import 'dotenv/config.js';
import { job, errorWhen } from '../lib/functional.js';
import logger from '../lib/logger.js';
import {
  messagesFromMonth, messagesWith, countCommitsFrom, contributorsFromMonth, allContributors,
} from '../lib/git.js';
import { linesInTable, linesInList } from '../lib/markdown.js';
import {
  resolve, mkdir, writePptx, reportName, frDate, loadTemplate, pptxExists, previousMonth,
} from '../lib/reporting.js';

const log = logger('Report');
const { info } = log;

const REPORT_NAME = process.env.COMMUNITY_REPORT_NAME || 'Community Rapport';
const OUTPUT = process.env.COMMUNITY_OUTPUT || 'output';
const name = reportName(REPORT_NAME);
const mkdirOut = mkdir(resolve(OUTPUT));
const previousDate = {
  month: previousMonth().getMonth() + 1,
  year: previousMonth().getFullYear(),
};
previousDate.month = 2;
const newMemberRegex = /doc\(members\)\s?:\s?(register|add)/;
const formatMembers = (members) => members.map((member) => ({ name: member }));
const messageToSubject = (type, scope) => (message) => {
  const search = message.match(new RegExp(`^${type}\\(${scope}s?\\s+(.*?)\\)\\s?:\\s?(.*?)\\s?$`));

  return search ? { subject: search[1], description: search[2] } : undefined;
};

job(log, async () => {
  info('Extract data from Git...');
  const messages = await messagesFromMonth(previousDate.month, previousDate.year);
  const members = linesInList(resolve('../MEMBERS.md'), 'members');
  const membersObj = members.reduce((all, member) => ({ ...all, [member.match(/<(.*?)@/)[1]]: member }), {});
  const newMembers = formatMembers(messagesWith(
    newMemberRegex,
    messages,
    (message) => membersObj[message.replace(newMemberRegex, '').trim()],
  ));
  const newContributors = formatMembers(
    await contributorsFromMonth(previousDate.month, previousDate.year, newMemberRegex),
  );
  const newSubjects = messagesWith(/sub\(subject/, messages, messageToSubject('sub', 'subject'));
  const newSubjectsStages = messagesWith(/stage\(subject/, messages, messageToSubject('stage', 'subject'));
  const newCoachings = messagesWith(/sub\(coaching/, messages, messageToSubject('sub', 'coaching'));
  const newA3s = messagesWith(/sub\(a3/, messages);
  const newShares = messagesWith(/sub\(share/, messages, messageToSubject('sub', 'shares'));
  const contributors = await allContributors(newMemberRegex);
  const subjects = linesInTable(resolve('../subjects/README.md'), 'subjects')
    .reduce((result, line) => {
      const attr = {
        '0️⃣': 'stage0',
        '1️⃣': 'stage1',
        '✅': 'finished',
        '❌': 'canceled',
      }[line.split('|')[4].trim()] || 'error';

      return { ...result, all: result.all.concat([line]), [attr]: result[attr].concat([line]) };
    }, {
      all: [],
      stage0: [],
      stage1: [],
      finished: [],
      canceled: [],
      error: [],
    });
  const coachings = linesInTable(resolve('../coachings/README.md'), 'coachings');
  const a3s = linesInTable(resolve('../A3/README.md'), 'a3');
  const configs = linesInTable(resolve('../shares/configs/README.md'), 'configs');
  const extensions = linesInTable(resolve('../shares/extensions/README.md'), 'extensions');
  const gists = linesInTable(resolve('../shares/gists/README.md'), 'gists');
  const snippets = linesInTable(resolve('../shares/snippets/README.md'), 'snippets');

  info('Load the template...');
  const writeReport = writePptx(name, OUTPUT);

  const data = {
    'report-date': frDate(),
    'new-members': newMembers,
    'new-members-length': newMembers.length,
    'members-length': members.length,
    'no-new-member': newMembers.length < 1,
    'new-contributors': newContributors,
    'new-contributors-length': newContributors.length,
    'no-new-contributor': newContributors.length < 1,
    'contributors-length': contributors.length,
    'new-commits-length': messages.length,
    'commits-length': await countCommitsFrom('main'),
    'new-subjects': newSubjects,
    'new-subjects-length': newSubjects.length,
    'no-new-subject': newSubjects.length < 1,
    'new-subjects-stages': newSubjectsStages,
    'no-new-subject-stage': newSubjectsStages.length < 1,
    'subjects-length': subjects.all.length,
    'subjects-stage0-length': subjects.stage0.length,
    'subjects-stage1-length': subjects.stage1.length,
    'subjects-canceled-length': subjects.canceled.length,
    'subjects-finished-length': subjects.finished.length,
    'new-coachings': newCoachings,
    'new-coachings-length': newCoachings.length,
    'no-new-coaching': newCoachings.length < 1,
    'coachings-length': coachings.length,
    'new-a3s-length': newA3s.length,
    'a3s-length': a3s.length,
    'new-shares': newShares,
    'new-shares-length': newShares.length,
    'no-new-shares': newShares.length < 1,
    'shares-length': configs.length + extensions.length + gists.length + snippets.length,
  };

  info('Create the output dir...');
  mkdirOut();

  errorWhen(pptxExists(name, OUTPUT), `The report "${name}" already exists. The generation is aborted.`);

  info(`Generate "${name}"...`);
  writeReport(loadTemplate('report', data));
}, () => info('[Done]'))();

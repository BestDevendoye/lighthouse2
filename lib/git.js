import simpleGit from 'simple-git';

const git = simpleGit();

const gitLogFromMonth = (month, year) => {
  const yearAter = parseInt(year, 10);
  let monthAfter = parseInt(month, 10);
  let monthBefore = monthAfter + 1 > 12 ? 1 : monthAfter + 1;
  const yearBefore = yearAter + (monthBefore === 1 ? 1 : 0);
  monthAfter = monthAfter < 10 ? `0${monthAfter}` : monthAfter;
  monthBefore = monthBefore < 10 ? `0${monthBefore}` : monthBefore;

  return {
    '--after': `"${yearAter}-${monthAfter}-01 00:00"`,
    '--before': `"${yearBefore}-${monthBefore}-01 00:00"`,
  };
};

export const commitsToMessages = (commits) => commits.all.map((log) => log.message);

export const messagesWith = (regex, messages, formatFn) => {
  const newMessages = messages.filter((message) => !!message.match(regex));

  return formatFn ? newMessages.map(formatFn).filter((message) => !!message) : newMessages;
};

export const messagesFromMonth = async (month, year) => commitsToMessages(await git.log(gitLogFromMonth(month, year)));

export const countCommitsFrom = async (branch) => (await git.raw(['rev-list', '--count', branch])).trim();

const contributorsQuery = async (options, filterRegex) => {
  let commits = (await git.log(options)).all;
  commits = filterRegex ? commits.filter((commit) => !commit.message.match(filterRegex)) : commits;
  commits = commits.map((commit) => `${commit.author_name} <${commit.author_email}>`);

  return [...new Set(commits)];
};

export const allContributors = (filterRegex) => contributorsQuery({}, filterRegex);
export const contributorsFromMonth = (month, year, filterRegex) => contributorsQuery(
  gitLogFromMonth(month, year),
  filterRegex,
);

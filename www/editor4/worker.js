onmessage = (event) => {
  const { Prolog, goal, count } = event.data;

  const query = Prolog.query(goal);
  const answers = [];

  do {
    const answer = query.next();
    answers.push(answer);
  } while (!answer.done && answers.length < count);

  query.close();

  postMessage(answers);
};

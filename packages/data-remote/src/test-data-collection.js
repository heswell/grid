const data = [];

const HB = /"HB"/;

export const saveTestData = (message, source) => {
  if (source === 'server' && HB.test(message)) {
    return;
  } else if (source === 'client') {
    message = JSON.stringify(message);
  }
  data.push(message);
};

export const getTestMessages = () => {
  const messages = data.slice();
  data.length = 0;
  return messages;
};

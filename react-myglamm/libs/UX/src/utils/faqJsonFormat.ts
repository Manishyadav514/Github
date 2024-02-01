export default function qaToJson(str: string) {
  try {
    const regex = /(<([^>]+)>)/gi;
    const splits = str.split('<span style="font-family: din-2014, sans-serif; font-size: 12pt;">'); // can be split since questions and answers are on separate lines in html
    let index = 0;
    const pairs: any[] = [];
    splits.forEach(split => {
      const q_matches = split.match(/(<strong>Q<\/strong>:)(.*)/);
      const a_matches = split.match(/(<strong>A<\/strong>:)(.*)/);
      if (!pairs[index]) pairs[index] = {};
      if (q_matches) {
        // its a question
        pairs[index].question = q_matches[2].trim().replace(regex, "");
      }
      if (a_matches) {
        // its an answer
        pairs[index].answer = a_matches[2].trim().replace(regex, "");
        index++; // increment count since an A for a Q was found, move to next Q:A
      }
    });
    // filter out pairs that have questions without answers
    return pairs.filter(p => p.question && p.answer);
  } catch (e) {
    return [];
  }
}

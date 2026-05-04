export type AnswerLetter = "A" | "B" | "C" | "D" | "E";

export type AnswerChoice = {
  letter: AnswerLetter;
  text: string;
};

export type LsatQuestion = {
  id: string;
  drillNumber: number;
  type: "Assumption" | "Strengthen" | "Weaken" | "Inference" | "Flaw";
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  topic: string;
  prompt: string;
  stem: string;
  choices: AnswerChoice[];
  correctAnswer: AnswerLetter;
  explanation: string;
  takeaway: string;
  published: boolean;
};

export const questions: LsatQuestion[] = [
  {
    id: "smart-parking-meters",
    drillNumber: 1,
    type: "Assumption",
    difficulty: "Medium",
    title: "Smart Parking Meters",
    topic: "City policy",
    prompt:
      "A city recently installed smart parking meters downtown. Since the installation, average parking revenue has increased by 18%. Therefore, the new meters must have made drivers more willing to pay for parking rather than avoid the meters.",
    stem: "Which answer is an assumption required by the argument?",
    choices: [
      {
        letter: "A",
        text: "The city did not reduce parking prices after installing the new meters.",
      },
      {
        letter: "B",
        text: "The increase in revenue was not mainly caused by more parking spaces being added downtown.",
      },
      {
        letter: "C",
        text: "Most drivers prefer smart parking meters to traditional coin-operated meters.",
      },
      {
        letter: "D",
        text: "The city plans to install smart meters in other neighborhoods.",
      },
      {
        letter: "E",
        text: "Parking revenue is the city’s largest source of transportation-related income.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The argument concludes that revenue increased because drivers became more willing to pay. But higher revenue could have another explanation: maybe the city added more parking spaces downtown. Choice B is required because it blocks that alternative explanation.",
    takeaway:
      "When an argument explains a result with one cause, ask whether another cause could explain the same result. Assumption questions often require blocking an alternative explanation.",
    published: true,
  },
];

export function getPublishedQuestions() {
  return questions
    .filter((question) => question.published)
    .sort((a, b) => a.drillNumber - b.drillNumber);
}

export function getLatestQuestion() {
  const publishedQuestions = getPublishedQuestions();

  return publishedQuestions[publishedQuestions.length - 1];
}

export function getQuestionById(id: string) {
  return questions.find((question) => question.id === id);
}
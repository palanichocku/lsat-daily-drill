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
  {
    id: "grocery-delivery-expansion",
    drillNumber: 2,
    type: "Strengthen",
    difficulty: "Medium",
    title: "Grocery Delivery Expansion",
    topic: "Business",
    prompt:
      "A regional grocery chain plans to expand its same-day delivery service to several suburban towns. Company executives argue that the expansion will increase profits because a recent customer survey showed that many suburban shoppers are interested in grocery delivery.",
    stem: "Which answer, if true, most strengthens the executives’ argument?",
    choices: [
      {
        letter: "A",
        text: "Several national grocery chains already offer same-day delivery in large cities.",
      },
      {
        letter: "B",
        text: "The suburban shoppers who expressed interest in delivery also reported that they would pay delivery fees high enough to cover the chain’s added costs.",
      },
      {
        letter: "C",
        text: "The grocery chain has operated in the region for more than twenty years.",
      },
      {
        letter: "D",
        text: "Some customers prefer choosing produce in person rather than having employees select it for them.",
      },
      {
        letter: "E",
        text: "The company’s current stores are larger than most competing grocery stores in the region.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The argument moves from customer interest to increased profits. But interest alone does not prove profitability. Choice B strengthens the argument because it connects demand to revenue that can cover added delivery costs.",
    takeaway:
      "For Strengthen questions, look for the answer that closes the biggest gap between the evidence and the conclusion.",
    published: true,
  },
  {
    id: "school-laptop-program",
    drillNumber: 3,
    type: "Weaken",
    difficulty: "Medium",
    title: "School Laptop Program",
    topic: "Education policy",
    prompt:
      "A school district gave every high school student a laptop last year. Since then, the district’s average test scores have increased. Therefore, the laptop program caused students to learn more effectively.",
    stem: "Which answer, if true, most weakens the argument?",
    choices: [
      {
        letter: "A",
        text: "Some students used their laptops for activities unrelated to schoolwork.",
      },
      {
        letter: "B",
        text: "The district also introduced a new test-preparation curriculum at the beginning of last year.",
      },
      {
        letter: "C",
        text: "Many teachers reported that students submitted assignments more quickly after receiving laptops.",
      },
      {
        letter: "D",
        text: "The laptop program cost less than district officials originally expected.",
      },
      {
        letter: "E",
        text: "Students in the district had used computer labs before the laptop program began.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The argument assumes the laptop program caused the higher test scores. Choice B weakens the argument by introducing another major change that could explain the score increase: the new test-preparation curriculum.",
    takeaway:
      "For Weaken questions, attack the link between evidence and conclusion. Alternative causes are especially powerful in cause-and-effect arguments.",
    published: true,
  },
  {
    id: "museum-attendance",
    drillNumber: 4,
    type: "Inference",
    difficulty: "Medium",
    title: "Museum Attendance",
    topic: "Culture and public programs",
    prompt:
      "The city museum offers free admission on the first Sunday of every month. On those Sundays, attendance is usually more than double the attendance on other Sundays. However, gift shop sales on free-admission Sundays are only slightly higher than gift shop sales on other Sundays.",
    stem: "Which answer is most strongly supported by the statements above?",
    choices: [
      {
        letter: "A",
        text: "Most visitors on free-admission Sundays spend less in the gift shop, on average, than visitors on other Sundays.",
      },
      {
        letter: "B",
        text: "The museum should stop offering free admission on the first Sunday of each month.",
      },
      {
        letter: "C",
        text: "Visitors who come on free-admission Sundays are less interested in art than visitors who come on other Sundays.",
      },
      {
        letter: "D",
        text: "Gift shop sales are the museum’s largest source of revenue.",
      },
      {
        letter: "E",
        text: "The museum has fewer staff members working on free-admission Sundays than on other Sundays.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Attendance more than doubles, but gift shop sales increase only slightly. That strongly suggests that the average gift shop spending per visitor is lower on free-admission Sundays than on other Sundays.",
    takeaway:
      "For Inference questions, do not reach beyond the facts. Pick the answer that must be true or is most strongly supported by the information given.",
    published: true,
  },
  {
    id: "remote-work-productivity",
    drillNumber: 5,
    type: "Flaw",
    difficulty: "Medium",
    title: "Remote Work Productivity",
    topic: "Workplace policy",
    prompt:
      "A consulting firm found that employees working remotely completed 12% more client reports per month than employees working in the office. Therefore, remote work makes employees more productive.",
    stem: "Which answer best describes a flaw in the argument?",
    choices: [
      {
        letter: "A",
        text: "The argument fails to consider whether employees assigned to remote work were already more productive before working remotely.",
      },
      {
        letter: "B",
        text: "The argument assumes that client reports are never useful unless they are completed quickly.",
      },
      {
        letter: "C",
        text: "The argument criticizes office workers rather than addressing the quality of their work.",
      },
      {
        letter: "D",
        text: "The argument treats a small increase in productivity as though it were a decrease.",
      },
      {
        letter: "E",
        text: "The argument concludes that remote work should be required for all employees in every industry.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "The argument compares remote workers with office workers and concludes that remote work caused higher productivity. But it does not rule out selection bias: maybe the employees who worked remotely were already more productive before the arrangement began.",
    takeaway:
      "For Flaw questions, ask what the argument failed to rule out. Comparisons often hide selection bias.",
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
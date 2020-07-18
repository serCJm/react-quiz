import React, { useState } from "react";
// Components
import QuestionCard from "./components/QuestionCard";
// Helpers
import { fetchQuizQuestions } from "./API";
// Types
import { Difficulty, QuestionState } from "./API";
// Styles
import { GlobalStyles, Wrapper } from "./App.styled";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};

function App() {
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0);
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);

	async function startTrivia() {
		setLoading(true);
		setGameOver(false);

		let newQuestions;
		try {
			newQuestions = await fetchQuizQuestions(
				TOTAL_QUESTIONS,
				Difficulty.EASY
			);
		} catch (e) {
			console.log(e);
		}

		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	}

	function checkAnswer(e: React.MouseEvent<HTMLButtonElement>) {
		if (!gameOver) {
			const answer = e.currentTarget.value;
			const correct = questions[number].correct_answer === answer;
			if (correct) {
				setScore((prev) => prev + 1);
			}
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer,
			};
			setUserAnswers((prev) => [...prev, answerObject]);
		}
	}

	function nextQuestion() {
		const nextQuestion = number + 1;
		if (nextQuestion === TOTAL_QUESTIONS) {
			setGameOver(true);
		} else {
			setNumber(nextQuestion);
		}
	}

	return (
		<>
			<GlobalStyles></GlobalStyles>
			<Wrapper>
				<h1>REACT QUIZ</h1>
				{gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
					<button className="start" onClick={startTrivia}>
						Start
					</button>
				) : null}

				{!gameOver && <p className="score">Score: {score}</p>}
				{loading && <p>Loading Questions ...</p>}
				{!loading && !gameOver && (
					<QuestionCard
						questionNumber={number + 1}
						totalQuestions={TOTAL_QUESTIONS}
						question={questions[number].question}
						answers={questions[number].answers}
						userAnswer={
							userAnswers ? userAnswers[number] : undefined
						}
						callback={checkAnswer}
					></QuestionCard>
				)}
				{!gameOver &&
					!loading &&
					userAnswers.length === number + 1 &&
					number !== TOTAL_QUESTIONS - 1 && (
						<button className="next" onClick={nextQuestion}>
							Next Question
						</button>
					)}
			</Wrapper>
		</>
	);
}

export default App;

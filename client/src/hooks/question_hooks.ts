import { useSelector } from "react-redux";
import { Question } from "../domain/models/question";
import { RootState } from "../store";

export const useQuestionSelector = (question: Question) => {
    const questionState = useSelector((state: RootState) => {
        if (question.id && question.id in state.question_answers) {
            return state.question_answers[question.id];
        }
    });
    return questionState;
}
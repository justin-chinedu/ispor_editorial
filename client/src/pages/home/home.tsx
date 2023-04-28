import { QuestionAnswers } from "../../components/question_answers/question_answers";
import { Footer } from "../../components/footer/footer";
import { Jumbotron } from "../../components/home/jumbotron";
import { Publications } from "../../components/home/publications";
import { QuestionForm } from "../../components/questions/question_form";
import { QuestionsCount } from "../../components/questions/questions_count";
import { RecentQuestions } from "../../components/questions/recent_questions";
import { mockQuestions } from "../../domain/models/question";
import { QuestionsList } from "../../components/questions/questions_list";

export const Home = () => {
    return (
        <div>
            <Jumbotron />
            <main className="bg-gradient-to-b to-gray-800 from-neutral-800 min-h-screen">
                <section className="px-4 pt-8">
                    <QuestionsCount />
                    <div className="flex flex-col gap-y-8 mt-8">
                        <div className="flex flex-wrap gap-x-8 gap-y-10">
                            <div className="grow sm:min-w-[400px] max-w-screen-md">
                                <QuestionForm />
                            </div>
                            <RecentQuestions />
                        </div>
                        <Publications />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}


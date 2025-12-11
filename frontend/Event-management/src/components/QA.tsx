/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import EventLayout from "../layout/EventLayout";
import { useFetchEventByID, useSendQuestion } from "../Queries/Allquery";
import { useParams } from "react-router";

const Questionnaire: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>() as { eventId: string };
  const { data } = useFetchEventByID(eventId);
  const {mutate:sendpassword}= useSendQuestion();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (data && data.questions) {
      const initialAnswers = data.questions.reduce((acc: Record<string, string>, question: any) => {
        acc[question._id] = question.answer || ""; 
        return acc;
      }, {});
      
      setAnswers(initialAnswers);
    }
  }, [data]); 

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value 
    }));
  };

  const handleBlur = async (questionId: string) => {
    console.log(`Answer for Question ${questionId} submitted:`, answers[questionId]);
    try {
      await sendpassword({id:questionId , ans:answers[questionId],eventid:eventId})
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <EventLayout>
      <div className="font-sans p-4 max-w mx-auto">
        <h2 className="text-xl font-bold md:text-2xl pl-3 mt-2 mb-6">Q&A</h2>
        {data && data.questions && data.questions.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="border border-gray-300 p-2 text-center">No</th>
          <th className="border border-gray-300 p-2 pl-4">Questions</th>
          <th className="border border-gray-300 p-2">Your Answer</th>
        </tr>
      </thead>
      <tbody>
        {data.questions.map((question: any, index: number) => (
          <tr key={question._id} className="border border-gray-300">
            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
            <td className="border border-gray-300 p-2 pl-4">{question.q}</td>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                onBlur={() => handleBlur(question._id)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="pl-3 text-2xl left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 text-red-600">No Q&A available</p>
)}

      </div>
    </EventLayout>
  );
};

export default Questionnaire;
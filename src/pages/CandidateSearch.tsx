import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const CandidateSearch = () => {
  const [candidatesBatch, setCandidatesBatch] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        await getRandomCandidateBatch();
      } catch (err){
        console.error('Error fetching candidate batch:', err);
      }
    };
    void fetchCandidates();
  }, []);

  const getRandomCandidateBatch = async () => {
    try {
      const userBatch: { login: string }[] = await searchGithub();
      if (Array.isArray(userBatch) && userBatch.length > 0) {
        const validCandidates: Candidate[] = [];
        const userDetailsPromises = userBatch.map(async (user) => {
          try {
            const userDetails = await searchGithubUser(user.login);
            if (userDetails?.login) {
              validCandidates.push(userDetails);
            }
          } catch (err) {
            console.error(`Error fetching details for user ${user.login}:`, err);
          }
        });

        await Promise.all(userDetailsPromises);
        setCandidatesBatch(validCandidates);
        setCurrentIndex(0);
        setCurrentCandidate(validCandidates[0] ?? null);
      } else {
        setCandidatesBatch([]);
        setCurrentCandidate(null);
      }
    } catch (err) {
      console.error('Error fetching candidates batch:', err);
    }
  };
  const handleNextCandidate = () => {
    if (currentIndex < candidatesBatch.length - 1){
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentCandidate(candidatesBatch[nextIndex]);
    } else {
      setCurrentCandidate(null);
    }
  };
  const addToSavedCandidatesList = () => {
    try{
      const savedCandidates: Candidate[] = JSON.parse(localStorage.getItem("savedCandidates") ?? "[]") as Candidate[];
      savedCandidates.push(currentCandidate!);
      localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));
    } catch (err) {
      console.error('Error saving candidate:', err);
    }
    handleNextCandidate();
  };

  return (
    <>
    <h1>Candidate Search</h1>
    <section id="searchSection"></section>
    <CandidateCard
    currentCandidate={currentCandidate}
    addToSavedCandidatesList={addToSavedCandidatesList}
    getRandomCandidate={handleNextCandidate}
    />
    </>
  )
};

export default CandidateSearch;

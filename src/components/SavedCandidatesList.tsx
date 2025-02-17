import { useEffect, useState, useCallback } from 'react';
import type Candidate from '../interfaces/Candidate.interface';
import { IoRemoveCircleSharp } from 'react-icons/io5';
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

import '../assets/styles/SavedCandidateList.css';

const SavedCandidatesList = () => {
    const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
    const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterText, setFilterText] = useState<string>("");

    useEffect(() => {
        const savedCandidatesStorage = localStorage.getItem("savedCandidates");
        const parsedCandidates: Candidate[] = savedCandidatesStorage ? (JSON.parse(savedCandidatesStorage) as Candidate[])
         : [];
        setSavedCandidates(parsedCandidates);
        setSortedCandidates(parsedCandidates);
    }, []);

        const removeCandidate = (candidateRemoved: Candidate) => {
            const updatedCandidates = savedCandidates.filter((candidate) => 
                candidate.login !== candidateRemoved.login);

            localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
            setSavedCandidates(updatedCandidates);
            setSortedCandidates(updatedCandidates);
        };

        const handleSort = () => {
            const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
            setSortOrder(newSortOrder);
            sortCandidates(newSortOrder);
        };
        const filterChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            const filterValue = e.target.value;
            setFilterText(filterValue);
        };

        const sortCandidates = useCallback((order: "asc" | "desc") => {
            const filteredCandidates = savedCandidates.filter((candidate) => {
                if (filterText === ""){
                    return true;
                }
                return candidate.bio?.toLowerCase().includes(filterText.toLowerCase());
            });

            const sortedArray = [...filteredCandidates];
            sortedArray.sort((a, b) => {
                const compareResult = (a.login ?? "").localeCompare(b.login ?? "");
                return order === "asc" ? compareResult : -compareResult;
            });
            setSortedCandidates(sortedArray);
        },
        [savedCandidates, filterText]
    );

    useEffect(() => {
        sortCandidates(sortOrder);
    },
    [filterText, sortOrder, savedCandidates, sortCandidates]
    );

    return(
        <div>
            {savedCandidates.length > 0 && (
                <div className="control-container">
                    <div>
                        <label htmlFor="bio-filter">Filter Bio: </label>
                        <input type="text" id="bio-filter" value={filterText} onChange={filterChanged} placeholder="Search by bio"/>
                    </div>
                    <button onClick={handleSort}>
                        {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                    </button>
                </div>
            )}
            {sortedCandidates.length === 0 ? (
                <div className='none-remaining'> No candidates found. Try again later!.</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Bio</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCandidates.map((candidate) => (
                            <tr key={candidate.login}>
                                <td className='graphic-cell'>
                                    <a href={candidate.html_url ?? ""} target="_blank" rel="noreferrer">
                                        <img src={candidate.avatar_url ?? ""} alt={`${candidate.name}'s avatar`} 
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                            }}
                                            />
                                    </a>
                                </td>
                                
                                    <td>
                                        {candidate.login} ({candidate.name ?? "N/A"})
                                    </td>
                                    <td>
                                        {candidate.location ?? "N/A"}
                                    </td>
                                    <td>
                                    {candidate.email ? (
                                        <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>{candidate.company ?? 'N/A'}</td>
                                <td>{candidate.bio ?? 'N/A'}</td>
                                <td className='graphic-cell'>
                                    <IoRemoveCircleSharp className='delete-button' onClick={() => removeCandidate(candidate)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SavedCandidatesList;
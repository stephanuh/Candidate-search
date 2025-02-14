// TODO: Create an interface for the Candidate objects returned by the API

interface Candidate {
    name: string | null;
    login: string | null;
    location: string | null;
    email: string | null;
    company: string | null;
    bio: string | null;
    html_url: string | null;
    avatar_url: string | null;
}

export default Candidate;
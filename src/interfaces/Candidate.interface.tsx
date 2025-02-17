// TODO: Create an interface for the Candidate objects returned by the API

interface Candidate {
    avatar_url: string | null;
    name: string | null;
    login: string | null;
    location: string | null;
    email: string | null;
    company: string | null;
    html_url: string | null;
    bio: string | null;
}

export default Candidate;
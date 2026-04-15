import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const ResumeParser = () => {
  const { refreshProfile } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [applyToProfile, setApplyToProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parsedResume, setParsedResume] = useState(null);
  const [latestResume, setLatestResume] = useState(null);

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const response = await api.get('/api/resume/latest');
        setLatestResume(response.data?.resume || null);
      } catch (fetchError) {
        console.error('Failed to load latest resume:', fetchError);
      }
    };

    fetchLatestResume();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Choose a resume file first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const fileDataUrl = await readFileAsDataUrl(selectedFile);
      const response = await api.post('/api/resume/parse', {
        fileName: selectedFile.name,
        fileDataUrl,
        applyToProfile,
      });

      setParsedResume(response.data);
      setLatestResume(response.data?.resume || null);
      setSuccess(
        response.data?.applied_to_profile
          ? 'Resume parsed and profile updated successfully.'
          : 'Resume parsed successfully.'
      );

      if (response.data?.applied_to_profile) {
        await refreshProfile();
      }
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Resume parsing failed.');
    } finally {
      setUploading(false);
    }
  };

  const parsed = parsedResume?.parsed;

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#f8fafc_0%,#ecfccb_40%,#f8fafc_100%)]">
      <nav className="border-b border-lime-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-lime-700">AI Workspace</p>
            <h1 className="text-2xl font-light text-slate-900">Resume Parser</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/dashboard" className="text-slate-600 transition-colors hover:text-slate-900">Dashboard</Link>
            <Link to="/assistant" className="text-slate-600 transition-colors hover:text-slate-900">Assistant</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-xl shadow-lime-100/70">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-lime-700">Structured Upload</p>
            <h2 className="mt-3 text-3xl font-light text-slate-900">Store resumes cleanly and extract profile-ready data</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Upload a resume in PDF, DOCX, TXT, or MD format. The backend stores the file under a dedicated resume
              directory and keeps metadata for the latest upload.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block rounded-3xl border border-dashed border-lime-300 bg-lime-50/70 p-6">
              <span className="block text-sm font-medium text-slate-900">Resume file</span>
              <span className="mt-2 block text-sm text-slate-600">PDF, DOCX, TXT, or MD</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="mt-4 block w-full text-sm text-slate-700"
              />
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={applyToProfile}
                onChange={(event) => setApplyToProfile(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-lime-700 focus:ring-lime-600"
              />
              <span>Apply extracted skills, bio summary, and academic year to my profile after parsing.</span>
            </label>

            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-800">{success}</div>}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-3xl bg-slate-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Parsing resume...' : 'Upload and Parse'}
            </button>
          </form>

          {latestResume && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Latest stored resume</p>
              <p className="mt-2">{latestResume.original_file_name}</p>
              <p className="mt-1">Uploaded: {new Date(latestResume.uploaded_at).toLocaleString()}</p>
              <p className="mt-1">Path: {latestResume.relative_path}</p>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-7 shadow-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Parsed Output</p>
          {!parsed ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-sm leading-7 text-slate-500">
              Upload a resume to see extracted contact details, skills, education signals, and a suggested profile bio.
            </div>
          ) : (
            <div className="mt-6 space-y-5 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p><span className="font-medium text-slate-900">Name:</span> {parsed.name || 'Not detected'}</p>
                <p className="mt-2"><span className="font-medium text-slate-900">Email:</span> {parsed.email || 'Not detected'}</p>
                <p className="mt-2"><span className="font-medium text-slate-900">Phone:</span> {parsed.phone || 'Not detected'}</p>
                <p className="mt-2"><span className="font-medium text-slate-900">Suggested year:</span> {parsed.suggested_year || 'Not detected'}</p>
              </div>

              <div className="rounded-3xl bg-lime-50 p-5">
                <p className="font-medium text-slate-900">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {parsed.skills?.length ? parsed.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-lime-200 bg-white px-3 py-1 text-xs text-slate-700">
                      {skill}
                    </span>
                  )) : <span className="text-slate-500">No skills detected</span>}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="font-medium text-slate-900">Education signals</p>
                <div className="mt-3 space-y-2">
                  {parsed.education?.length ? parsed.education.map((item) => (
                    <p key={item}>{item}</p>
                  )) : <p className="text-slate-500">No education section detected</p>}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 p-5 text-slate-100">
                <p className="font-medium">Suggested bio</p>
                <p className="mt-3 leading-7">{parsed.suggested_bio || 'No bio summary generated.'}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumeParser;

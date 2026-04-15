import axios from 'axios';
import path from 'path';
import supabase from '../utils/supabase.js';
import {
  getLatestResumeManifestForProfile,
  recordResumeManifest,
  saveResumeFile,
} from '../utils/fileStorage.js';

const RESUME_SERVICE_URL = 'http://localhost:5001/api/resume/parse';

const guessMimeType = (fileName) => {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case '.pdf':
      return 'application/pdf';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.txt':
      return 'text/plain';
    case '.md':
      return 'text/markdown';
    default:
      return 'application/octet-stream';
  }
};

const parseDataUrl = (value) => {
  const match = String(value || '').match(/^data:(.*?);base64,(.*)$/);
  if (!match) {
    throw new Error('Invalid file payload');
  }

  return {
    mimeType: match[1],
    base64Content: match[2],
  };
};

export const parseResume = async (req, res) => {
  try {
    const { fileName, fileDataUrl, applyToProfile = false } = req.body;
    const userId = req.user.id;

    if (!fileName || !fileDataUrl) {
      return res.status(400).json({ success: false, message: 'fileName and fileDataUrl are required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const { mimeType, base64Content } = parseDataUrl(fileDataUrl);
    const detectedMimeType = mimeType || guessMimeType(fileName);

    const storedFile = await saveResumeFile({
      profileId: profile.id,
      fileName,
      base64Content,
    });

    const parseResponse = await axios.post(
      RESUME_SERVICE_URL,
      {
        file_path: storedFile.absolutePath,
      },
      { timeout: 15000 }
    );

    const parsed = parseResponse.data || {};

    if (applyToProfile) {
      const updatePayload = {};

      if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
        updatePayload.skills = parsed.skills;
      }

      if (parsed.suggested_bio) {
        updatePayload.bio = parsed.suggested_bio;
      }

      if (parsed.suggested_year) {
        updatePayload.year = parsed.suggested_year;
      }

      if (Object.keys(updatePayload).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updatePayload)
          .eq('id', profile.id);

        if (updateError) throw updateError;
      }
    }

    const manifestEntry = await recordResumeManifest({
      profile_id: profile.id,
      user_id: userId,
      original_file_name: fileName,
      stored_file_name: storedFile.storedFileName,
      relative_path: storedFile.relativePath,
      absolute_path: storedFile.absolutePath,
      mime_type: detectedMimeType,
      size_in_bytes: storedFile.sizeInBytes,
      uploaded_at: storedFile.uploadedAt,
      parsed_at: new Date().toISOString(),
      parsed_summary: {
        name: parsed.name || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      },
    });

    res.json({
      success: true,
      resume: {
        ...manifestEntry,
        file_extension: path.extname(fileName).toLowerCase(),
      },
      parsed,
      applied_to_profile: Boolean(applyToProfile),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' ? 503 : 502;
      return res.status(status).json({
        success: false,
        message: 'Resume parsing service is unavailable right now',
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const latestResume = await getLatestResumeManifestForProfile(profile.id);
    res.json({ success: true, resume: latestResume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { gql, TypedDocumentNode } from '@apollo/client';
import { CreateNoteResponse } from '../types/note';

// Fields shown on a note card or list row. `content` is NOT here because it is only fetched on the detail page.
export const NOTE_FIELDS = gql`
  fragment NoteFields on Note {
    documentId
    title
    pinned
    archived
    updatedAt
    wordCount
    readingTime
    excerpt(length: 180)
    tags {
      documentId
      name
      slug
      color
    }
  }
`;

export const ACTIVE_NOTES = gql`
  ${NOTE_FIELDS}
  query ActiveNotes {
    notes(sort: ["pinned:desc", "updatedAt:desc"]) {
      ...NoteFields
    }
  }
`;

export const NOTE_DETAIL = gql`
  ${NOTE_FIELDS}
  query Note($documentId: ID!) {
    note(documentId: $documentId) {
      ...NoteFields
      content
    }
  }
`;

export const TAGS = gql`
  query Tags {
    tags(sort: ["name:asc"]) {
      documentId
      name
      slug
      color
    }
  }
`;

export const CREATE_NOTE: TypedDocumentNode<CreateNoteResponse> = gql`
  mutation CreateNote($data: NoteInput!) {
    createNote(data: $data) {
      documentId
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($documentId: ID!, $data: NoteInput!) {
    updateNote(documentId: $documentId, data: $data) {
      documentId
    }
  }
`;

export const TOGGLE_PIN = gql`
  mutation TogglePin($documentId: ID!) {
    togglePin(documentId: $documentId) {
      documentId
      pinned
    }
  }
`;

export const ARCHIVE_NOTE = gql`
  mutation ArchiveNote($documentId: ID!) {
    archiveNote(documentId: $documentId) {
      documentId
      archived
    }
  }
`;

export const SEARCH_NOTES = gql`
  ${NOTE_FIELDS}
  query SearchNotes($q: String!) {
    searchNotes(query: $q) {
      ...NoteFields
    }
  }
`;

export const NOTES_BY_TAG = gql`
  ${NOTE_FIELDS}
  query NotesByTag($slug: String!) {
    notesByTag(slug: $slug) {
      ...NoteFields
    }
  }
`;

export const NOTE_STATS = gql`
  query NoteStats {
    noteStats {
      total
      pinned
      archived
      byTag {
        slug
        name
        count
      }
    }
  }
`;

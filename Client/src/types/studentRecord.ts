export type KindCount = {
  disease: number
  unexcused: number
  other: number
}

export type AttendanceRow = {
  grade: number
  classDays: number
  absent: KindCount
  tardy: KindCount
  earlyLeave: KindCount
  result: KindCount
  notes: string
}

export type AwardRow = {
  category: 'internal' | 'external'
  title: string
  rank: string
  awardedAt: string
  organization: string
  participants: string
}

export type StudentRecordForm = {
  specialNotes: string
  academic: {
    middleSchoolName: string
    middleSchoolGraduationYear: string
    highSchoolName: string
    highSchoolAdmissionYear: string
    notes: string
  }
  attendance: AttendanceRow[]
  awards: AwardRow[]
}

export function emptyKindCount(): KindCount {
  return { disease: 0, unexcused: 0, other: 0 }
}

export function emptyRecordForm(): StudentRecordForm {
  return {
    specialNotes: '',
    academic: {
      middleSchoolName: '',
      middleSchoolGraduationYear: '',
      highSchoolName: '',
      highSchoolAdmissionYear: '',
      notes: '',
    },
    attendance: [1, 2, 3].map((grade) => ({
      grade,
      classDays: 0,
      absent: emptyKindCount(),
      tardy: emptyKindCount(),
      earlyLeave: emptyKindCount(),
      result: emptyKindCount(),
      notes: '',
    })),
    awards: [],
  }
}

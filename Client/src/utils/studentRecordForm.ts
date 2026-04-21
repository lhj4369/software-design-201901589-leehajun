import { emptyRecordForm } from '../types/studentRecord'
import type { StudentRecordForm, AttendanceRow, AwardRow } from '../types/studentRecord'

function toDateInput(v: unknown): string {
  if (!v) return ''
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function mergeRecordForm(raw: unknown): StudentRecordForm {
  const base = emptyRecordForm()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Record<string, unknown>

  if (typeof r.specialNotes === 'string') base.specialNotes = r.specialNotes

  if (r.academic && typeof r.academic === 'object') {
    const a = r.academic as Record<string, unknown>
    base.academic = {
      middleSchoolName: String(a.middleSchoolName || ''),
      middleSchoolGraduationYear:
        a.middleSchoolGraduationYear == null ? '' : String(a.middleSchoolGraduationYear),
      highSchoolName: String(a.highSchoolName || ''),
      highSchoolAdmissionYear:
        a.highSchoolAdmissionYear == null ? '' : String(a.highSchoolAdmissionYear),
      notes: String(a.notes || ''),
    }
  }

  if (Array.isArray(r.attendance)) {
    const rows: AttendanceRow[] = r.attendance.map((it) => {
      const row = it as Record<string, unknown>
      const cat = (key: string) => {
        const c = row[key] as Record<string, unknown> | undefined
        return {
          disease: Number(c?.disease || 0),
          unexcused: Number(c?.unexcused || 0),
          other: Number(c?.other || 0),
        }
      }
      return {
        grade: Number(row.grade || 1),
        classDays: Number(row.classDays || 0),
        absent: cat('absent'),
        tardy: cat('tardy'),
        earlyLeave: cat('earlyLeave'),
        result: cat('result'),
        notes: String(row.notes || ''),
      }
    })
    if (rows.length) base.attendance = rows.sort((a, b) => a.grade - b.grade)
  }

  if (Array.isArray(r.awards)) {
    base.awards = r.awards.map((it) => {
      const a = it as Record<string, unknown>
      return {
        category: a.category === 'external' ? 'external' : 'internal',
        title: String(a.title || ''),
        rank: String(a.rank || ''),
        awardedAt: toDateInput(a.awardedAt),
        organization: String(a.organization || ''),
        participants: a.participants == null ? '' : String(a.participants),
      } as AwardRow
    })
  }

  return base
}

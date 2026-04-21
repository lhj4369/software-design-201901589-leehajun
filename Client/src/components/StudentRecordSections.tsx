import type { StudentRecordForm } from '../types/studentRecord'

type PersonalBlock = {
  name: string
  birthDate: string
  gender: 'male' | 'female' | null | undefined
  residentId: string
  address: string
  fatherName: string
  fatherBirthDate: string
  motherName: string
  motherBirthDate: string
}

type Props = {
  value: StudentRecordForm
  personal: PersonalBlock
  onChange?: (next: StudentRecordForm) => void
  onPersonalChange?: (next: PersonalBlock) => void
  readonly?: boolean
}

function n(v: string) {
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}

export function StudentRecordSections({
  value,
  personal,
  onChange,
  onPersonalChange,
  readonly = false,
}: Props) {
  const ro = readonly || !onChange

  function setField<K extends keyof StudentRecordForm>(k: K, v: StudentRecordForm[K]) {
    if (ro || !onChange) return
    onChange({ ...value, [k]: v })
  }

  function setPersonal<K extends keyof PersonalBlock>(k: K, v: PersonalBlock[K]) {
    if (readonly || !onPersonalChange) return
    onPersonalChange({ ...personal, [k]: v })
  }

  function setAcademic(key: keyof StudentRecordForm['academic'], v: string) {
    setField('academic', { ...value.academic, [key]: v })
  }

  function setAttendance(i: number, key: keyof StudentRecordForm['attendance'][number], v: unknown) {
    if (ro || !onChange) return
    const copy = [...value.attendance]
    copy[i] = { ...copy[i], [key]: v } as StudentRecordForm['attendance'][number]
    onChange({ ...value, attendance: copy })
  }

  function setAttendanceKind(i: number, k: 'absent' | 'tardy' | 'earlyLeave' | 'result', kind: 'disease'|'unexcused'|'other', v: string) {
    const row = value.attendance[i]
    setAttendance(i, k, { ...row[k], [kind]: n(v) })
  }

  function setAward(i: number, key: keyof StudentRecordForm['awards'][number], v: string) {
    if (ro || !onChange) return
    const copy = [...value.awards]
    copy[i] = { ...copy[i], [key]: v } as StudentRecordForm['awards'][number]
    onChange({ ...value, awards: copy })
  }

  function removeAward(i: number) {
    if (ro || !onChange) return
    const copy = value.awards.filter((_, idx) => idx !== i)
    onChange({ ...value, awards: copy })
  }

  return (
    <div className="record-sections">
      <section className="record-card">
        <h3>1. 인적사항</h3>
        <div className="table-wrap">
          <table className="data-table record-basic-table">
            <tbody>
              <tr>
                <th>학 생</th>
                <td>
                  성명 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.name || '—'}</strong>
                  ) : (
                    <input value={personal.name} onChange={(e) => setPersonal('name', e.target.value)} />
                  )}
                </td>
                <td>
                  생년월일 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.birthDate || '—'}</strong>
                  ) : (
                    <input type="date" value={personal.birthDate} onChange={(e) => setPersonal('birthDate', e.target.value)} />
                  )}
                </td>
                <td>
                  성별 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.gender === 'female' ? '여' : '남'}</strong>
                  ) : (
                    <select value={personal.gender || 'male'} onChange={(e) => setPersonal('gender', e.target.value as 'male' | 'female')}>
                      <option value="male">남</option>
                      <option value="female">여</option>
                    </select>
                  )}
                </td>
                <td>
                  주민등록번호 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.residentId || '—'}</strong>
                  ) : (
                    <input value={personal.residentId} onChange={(e) => setPersonal('residentId', e.target.value)} />
                  )}
                </td>
              </tr>
              <tr>
                <th>주 소</th>
                <td colSpan={4}>
                  {readonly ? (
                    <strong className="record-inline-value">{personal.address || '—'}</strong>
                  ) : (
                    <input value={personal.address} onChange={(e) => setPersonal('address', e.target.value)} />
                  )}
                </td>
              </tr>
              <tr>
                <th rowSpan={2}>가족상황</th>
                <td>
                  부 성명 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.fatherName || '—'}</strong>
                  ) : (
                    <input value={personal.fatherName} onChange={(e) => setPersonal('fatherName', e.target.value)} />
                  )}
                </td>
                <td colSpan={3}>
                  부 생년월일 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.fatherBirthDate || '—'}</strong>
                  ) : (
                    <input type="date" value={personal.fatherBirthDate} onChange={(e) => setPersonal('fatherBirthDate', e.target.value)} />
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  모 성명 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.motherName || '—'}</strong>
                  ) : (
                    <input value={personal.motherName} onChange={(e) => setPersonal('motherName', e.target.value)} />
                  )}
                </td>
                <td colSpan={3}>
                  모 생년월일 :
                  {readonly ? (
                    <strong className="record-inline-value">{personal.motherBirthDate || '—'}</strong>
                  ) : (
                    <input type="date" value={personal.motherBirthDate} onChange={(e) => setPersonal('motherBirthDate', e.target.value)} />
                  )}
                </td>
              </tr>
              <tr>
                <th>특기사항</th>
                <td colSpan={4}>
                  {readonly ? (
                    <strong className="record-inline-value">{value.specialNotes || '-'}</strong>
                  ) : (
                    <textarea className="record-textarea" value={value.specialNotes} onChange={(e) => setField('specialNotes', e.target.value)} readOnly={ro} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="record-card">
        <h3>2. 학적사항</h3>
        <div className="table-wrap">
          <table className="data-table record-academic-table">
            <tbody>
              <tr>
                <td colSpan={2}>
                  {readonly ? (
                    <strong className="record-inline-value record-preline">{value.academic.middleSchoolName || '—'}</strong>
                  ) : (
                    <textarea
                      className="record-textarea"
                      value={value.academic.middleSchoolName}
                      onChange={(e)=>setAcademic('middleSchoolName', e.target.value)}
                      placeholder="예:
2024년 2월 10일 00중학교 제3학년 졸업
2024년 3월 2일 00고등학교 제1학년 입학"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th>특기사항</th>
                <td>
                  {readonly ? (
                    <strong className="record-inline-value">{value.academic.notes || '—'}</strong>
                  ) : (
                    <input value={value.academic.notes} onChange={(e)=>setAcademic('notes', e.target.value)} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="record-card">
        <h3>3. 출결상황</h3>
        <div className="table-wrap">
          <table className="data-table record-table">
            <thead>
              <tr>
                <th rowSpan={2}>학년</th>
                <th rowSpan={2}>수업일수</th>
                <th colSpan={3}>결석일수</th>
                <th colSpan={3}>지각</th>
                <th colSpan={3}>조퇴</th>
                <th colSpan={3}>결과</th>
                <th rowSpan={2}>특기사항</th>
              </tr>
              <tr>
                <th>질병</th><th>무단</th><th>기타</th>
                <th>질병</th><th>무단</th><th>기타</th>
                <th>질병</th><th>무단</th><th>기타</th>
                <th>질병</th><th>무단</th><th>기타</th>
              </tr>
            </thead>
            <tbody>
              {value.attendance.map((r, i) => (
                <tr key={r.grade}>
                  <td>{r.grade}</td>
                  <td>
                    {readonly ? (
                      <strong className="record-inline-value">{r.classDays || '-'}</strong>
                    ) : (
                      <input className="tiny-input" value={String(r.classDays)} onChange={(e)=>setAttendance(i,'classDays', n(e.target.value))} readOnly={ro} />
                    )}
                  </td>
                  {readonly ? (
                    <>
                      <td>{r.absent.disease || '-'}</td><td>{r.absent.unexcused || '-'}</td><td>{r.absent.other || '-'}</td>
                      <td>{r.tardy.disease || '-'}</td><td>{r.tardy.unexcused || '-'}</td><td>{r.tardy.other || '-'}</td>
                      <td>{r.earlyLeave.disease || '-'}</td><td>{r.earlyLeave.unexcused || '-'}</td><td>{r.earlyLeave.other || '-'}</td>
                      <td>{r.result.disease || '-'}</td><td>{r.result.unexcused || '-'}</td><td>{r.result.other || '-'}</td>
                      <td>{r.notes || '-'}</td>
                    </>
                  ) : (
                    <>
                      <td><input className="tiny-input" value={String(r.absent.disease)} onChange={(e)=>setAttendanceKind(i,'absent','disease',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.absent.unexcused)} onChange={(e)=>setAttendanceKind(i,'absent','unexcused',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.absent.other)} onChange={(e)=>setAttendanceKind(i,'absent','other',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.tardy.disease)} onChange={(e)=>setAttendanceKind(i,'tardy','disease',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.tardy.unexcused)} onChange={(e)=>setAttendanceKind(i,'tardy','unexcused',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.tardy.other)} onChange={(e)=>setAttendanceKind(i,'tardy','other',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.earlyLeave.disease)} onChange={(e)=>setAttendanceKind(i,'earlyLeave','disease',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.earlyLeave.unexcused)} onChange={(e)=>setAttendanceKind(i,'earlyLeave','unexcused',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.earlyLeave.other)} onChange={(e)=>setAttendanceKind(i,'earlyLeave','other',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.result.disease)} onChange={(e)=>setAttendanceKind(i,'result','disease',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.result.unexcused)} onChange={(e)=>setAttendanceKind(i,'result','unexcused',e.target.value)} readOnly={ro} /></td>
                      <td><input className="tiny-input" value={String(r.result.other)} onChange={(e)=>setAttendanceKind(i,'result','other',e.target.value)} readOnly={ro} /></td>
                      <td><input value={r.notes} onChange={(e)=>setAttendance(i,'notes', e.target.value)} readOnly={ro} /></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="record-card">
        <h3>4. 수상경력</h3>
        {!ro ? (
          <button type="button" className="add-student-btn" onClick={() => setField('awards', [...value.awards, { category: 'internal', title: '', rank: '', awardedAt: '', organization: '', participants: '' }])}>
            + 수상 추가
          </button>
        ) : null}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>구분</th><th>수상명</th><th>등급(위)</th><th>수상연월일</th><th>수여기관</th><th>참가대상(인원)</th>{!ro ? <th>삭제</th> : null}
              </tr>
            </thead>
            <tbody>
              {value.awards.length === 0 ? (
                <tr><td colSpan={ro ? 6 : 7}>기록 없음</td></tr>
              ) : value.awards.map((a, i) => (
                <tr key={i}>
                  <td>
                    {ro ? (a.category === 'external' ? '교외상' : '교내상') : (
                      <select value={a.category} onChange={(e)=>setAward(i,'category',e.target.value)}>
                        <option value="internal">교내상</option><option value="external">교외상</option>
                      </select>
                    )}
                  </td>
                  <td>{ro ? (a.title || '-') : <input value={a.title} onChange={(e)=>setAward(i,'title',e.target.value)} />}</td>
                  <td>{ro ? (a.rank || '-') : <input value={a.rank} onChange={(e)=>setAward(i,'rank',e.target.value)} />}</td>
                  <td>{ro ? (a.awardedAt || '-') : <input type="date" value={a.awardedAt} onChange={(e)=>setAward(i,'awardedAt',e.target.value)} />}</td>
                  <td>{ro ? (a.organization || '-') : <input value={a.organization} onChange={(e)=>setAward(i,'organization',e.target.value)} />}</td>
                  <td>{ro ? (a.participants || '-') : <input value={a.participants} onChange={(e)=>setAward(i,'participants',e.target.value)} />}</td>
                  {!ro ? (
                    <td>
                      <button
                        type="button"
                        className="award-remove-btn"
                        onClick={() => removeAward(i)}
                        aria-label="수상 항목 삭제"
                        title="삭제"
                      >
                        ×
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

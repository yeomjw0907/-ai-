"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  PASSWORD_MIN_LENGTH,
  STUDENT_NO_PATTERN,
  isStrongEnoughPassword,
  isValidStudentNo,
  normalizeStudentNo,
  studentNoToEmail,
} from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const DEPARTMENTS = [
  "대순종학과",
  "영어영문학과",
  "역사문화콘텐츠학과",
  "문예콘텐츠창작학과",
  "시각디자인학과",
  "산업디자인학과",
  "영화영상학과",
  "연기예술학과",
  "글로벌경제학과",
  "경영학과",
  "국제통상학과",
  "국제지역학과",
  "중국학과",
  "공공인재법학과",
  "행정정보학과",
  "사회복지학과",
  "아동학과",
  "미디어커뮤니케이션학과",
  "문헌정보학과",
  "간호학과",
  "스포츠건강과학과",
  "식품영양학과",
  "의생명과학과",
  "스마트시티환경공학과",
  "AI건설융합공학과",
  "건축공학과",
  "컴퓨터공학과",
  "전기공학과",
  "반도체융합공학과",
  "화학공학과",
  "IT기계공학과",
  "데이터경영산업공학과",
  "보건경영학과",
  "스마트융합보안학과",
  "AI빅데이터공학과",
  "스마트모빌리티공학과",
  "만화게임그래픽학과",
];

export default function SignupPage() {
  const router = useRouter();
  const [studentNo, setStudentNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase 환경변수가 아직 설정되지 않았습니다.");
      return;
    }

    const normalizedStudentNo = normalizeStudentNo(studentNo);
    const trimmedName = name.trim();
    const trimmedDepartment = department.trim();

    if (!isValidStudentNo(normalizedStudentNo)) {
      setMessage("학번은 숫자 6~12자리로 입력하세요.");
      return;
    }

    if (!trimmedName || !trimmedDepartment) {
      setMessage("이름과 과를 입력하세요.");
      return;
    }

    if (!isStrongEnoughPassword(password)) {
      setMessage(`비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상, 영문과 숫자를 포함해야 합니다.`);
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("비밀번호가 서로 다릅니다.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: studentNoToEmail(normalizedStudentNo),
      password,
      options: {
        data: {
          student_no: normalizedStudentNo,
          name: trimmedName,
          department: trimmedDepartment,
        },
      },
    });

    if (error || !data.user) {
      setMessage(error?.message.includes("already") ? "이미 가입된 학번입니다." : "가입 정보를 확인하세요.");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      student_no: normalizedStudentNo,
      name: trimmedName,
      department: trimmedDepartment,
    });

    if (profileError) {
      setMessage("프로필 저장에 실패했습니다. 잠시 후 다시 시도하세요.");
      setIsLoading(false);
      return;
    }

    setMessage("가입이 완료되었습니다.");
    setIsLoading(false);
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">회원가입</h1>
      <form onSubmit={handleSignup} className="space-y-3 rounded-card border border-line bg-surface p-6 shadow-sm">
        <input
          value={studentNo}
          onChange={(event) => setStudentNo(normalizeStudentNo(event.target.value))}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="학번"
          inputMode="numeric"
          pattern={STUDENT_NO_PATTERN.source}
          maxLength={12}
          required
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="이름"
          required
        />
        <DepartmentSelect value={department} onChange={setDepartment} />
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="비밀번호"
          minLength={PASSWORD_MIN_LENGTH}
          required
        />
        <PasswordInput
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          placeholder="비밀번호 확인"
          minLength={PASSWORD_MIN_LENGTH}
          required
        />
        <p className="text-xs leading-5 text-ink-muted">
          학번은 숫자 6~12자리, 비밀번호는 {PASSWORD_MIN_LENGTH}자 이상이며 영문과 숫자를 포함해야 합니다.
        </p>
        <button
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </button>
        {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
        <p className="pt-1 text-center text-xs text-ink-muted">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-semibold text-primary">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  minLength,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minLength?: number;
  required?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-ctl border border-line px-3 py-3 pr-12 text-sm outline-none transition focus:border-primary"
        placeholder={placeholder}
        minLength={minLength}
        required={required}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-primary/10 hover:text-primary"
        aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function DepartmentSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const filteredDepartments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return DEPARTMENTS;

    return DEPARTMENTS.filter((department) =>
      department.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  function selectDepartment(nextDepartment: string) {
    setQuery(nextDepartment);
    onChange(nextDepartment);
    setIsOpen(false);
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <input
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          onChange(nextValue);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
        placeholder="과 검색 또는 직접 입력"
        role="combobox"
        aria-expanded={isOpen}
        required
      />

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-72 overflow-auto rounded-ctl border border-line bg-surface p-2 shadow-lg">
          <p className="px-2 pb-2 text-[11px] font-semibold text-ink-muted">검색 결과</p>
          {filteredDepartments.length > 0 ? (
            <div className="space-y-1">
              {filteredDepartments.map((department) => (
                <button
                  key={department}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectDepartment(department);
                  }}
                  className={`w-full rounded-[10px] px-3 py-2.5 text-left text-sm transition ${
                    value === department
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-ink hover:bg-primary/5"
                  }`}
                >
                  {department}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-[10px] bg-bg px-3 py-3 text-sm text-ink-muted">
              일치하는 학과가 없어요.
            </p>
          )}

          <div className="mt-2 border-t border-line pt-2">
            <label className="px-2 text-[11px] font-semibold text-ink-muted" htmlFor="custom-department">
              직접 입력
            </label>
            <input
              id="custom-department"
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value;
                setQuery(nextValue);
                onChange(nextValue);
              }}
              className="mt-1 w-full rounded-[10px] border border-line bg-bg px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="목록에 없으면 직접 입력"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

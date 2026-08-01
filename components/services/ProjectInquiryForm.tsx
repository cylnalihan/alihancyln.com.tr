"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type RefObject,
} from "react";

import {
  FIELD_LIMITS,
  FILE_RULES,
  formatFileSize,
} from "@/lib/project-inquiry";
import type { Locale } from "@/i18n/config";
import type { services as trServices } from "@/i18n/dictionaries/tr/services";
import type { DeepWiden } from "@/i18n/types";

import styles from "./ServicesPage.module.css";

type ProjectInquiryFormProps = {
  panelId: string;
  isOpen: boolean;
  locale: Locale;
  projectTypes: readonly { id: string; label: string }[];
  initialProjectTypeId: string;
  dictionary: DeepWiden<typeof trServices>["form"];
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

type SubmitState =
  | { type: "idle"; message: "" }
  | { type: "error" | "success"; message: string };

type SelectedFile = {
  file: File;
  id: string;
  previewUrl?: string;
};

function createClientId() {
  const webCrypto = globalThis.crypto;

  if (webCrypto?.randomUUID) {
    return webCrypto.randomUUID();
  }

  if (webCrypto?.getRandomValues) {
    return Array.from(webCrypto.getRandomValues(new Uint8Array(16)), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  const fallback = `${Date.now().toString(16)}${Math.random()
    .toString(16)
    .slice(2)}`;
  return fallback.padEnd(32, "0").slice(0, 32);
}

function clientFileError(
  files: readonly File[],
  messages: ProjectInquiryFormProps["dictionary"]["fileErrors"],
) {
  if (files.length > FILE_RULES.maxFiles) {
    return messages.tooMany;
  }

  if (files.some((file) => file.size > FILE_RULES.maxFileBytes)) {
    return messages.tooLarge;
  }

  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > FILE_RULES.maxTotalBytes) {
    return messages.totalTooLarge;
  }

  const allowedExtensions = /\.(jpe?g|png|webp|pdf|docx?)$/i;
  if (files.some((file) => !allowedExtensions.test(file.name))) {
    return messages.unsupported;
  }

  return "";
}

export function ProjectInquiryForm({
  panelId,
  isOpen,
  locale,
  projectTypes,
  initialProjectTypeId,
  dictionary,
  triggerRef,
  onClose,
  onDirtyChange,
}: ProjectInquiryFormProps) {
  const formId = useId().replace(/:/g, "");
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const projectTypeRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openedAtRef = useRef<number | null>(null);
  const [initialSubmissionId] = useState(createClientId);
  const submissionIdRef = useRef(initialSubmissionId);
  const wasOpenRef = useRef(false);
  const selectedFilesRef = useRef<SelectedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      openedAtRef.current = Date.now();
      if (!isDirty && projectTypeRef.current) {
        projectTypeRef.current.value = initialProjectTypeId;
      }
      window.requestAnimationFrame(() => nameRef.current?.focus());
    } else if (!isOpen && wasOpenRef.current) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }

    wasOpenRef.current = isOpen;
  }, [initialProjectTypeId, isDirty, isOpen, triggerRef]);

  useEffect(() => {
    return () => {
      selectedFilesRef.current.forEach(({ previewUrl }) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDirty && !isSubmitting) {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDirty, isOpen, isSubmitting, onClose]);

  function markDirty() {
    if (!isDirty) {
      setIsDirty(true);
      onDirtyChange(true);
    }
    if (submitState.type !== "idle") {
      setSubmitState({ type: "idle", message: "" });
    }
  }

  function replaceFiles(nextFiles: File[]) {
    const error = clientFileError(nextFiles, dictionary.fileErrors);
    setFileError(error);
    if (error) return;

    selectedFiles.forEach(({ previewUrl }) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    });

    setSelectedFiles(
      nextFiles.map((file) => ({
        file,
        id: createClientId(),
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })),
    );
    if (nextFiles.length) markDirty();
  }

  function addFiles(incoming: File[]) {
    replaceFiles([...selectedFiles.map(({ file }) => file), ...incoming]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(id: string) {
    const target = selectedFiles.find((item) => item.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    const next = selectedFiles.filter((item) => item.id !== id);
    setSelectedFiles(next);
    setFileError("");
    markDirty();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const error = clientFileError(
      selectedFiles.map(({ file }) => file),
      dictionary.fileErrors,
    );
    if (error) {
      setFileError(error);
      return;
    }

    const data = new FormData(form);
    selectedFiles.forEach(({ file }) => data.append("files", file, file.name));
    data.set("openedAt", String(openedAtRef.current ?? Date.now()));
    data.set("submissionId", submissionIdRef.current);
    data.set("locale", locale);

    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        body: data,
      });
      const result = (await response.json().catch(() => null)) as {
        code?: string;
      } | null;

      if (!response.ok) {
        const code = result?.code as keyof typeof dictionary.apiErrors;
        throw new Error(dictionary.apiErrors[code] ?? dictionary.apiErrors.UNKNOWN);
      }

      selectedFiles.forEach(({ previewUrl }) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
      form.reset();
      setSelectedFiles([]);
      setFileError("");
      setIsDirty(false);
      onDirtyChange(false);
      submissionIdRef.current = createClientId();
      openedAtRef.current = Date.now();
      if (projectTypeRef.current) {
        projectTypeRef.current.value = initialProjectTypeId;
      }
      setSubmitState({
        type: "success",
        message: dictionary.success,
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : dictionary.apiErrors.UNKNOWN,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      id={panelId}
      className={styles.formReveal}
      data-open={isOpen}
      aria-hidden={!isOpen}
    >
      <div className={styles.formRevealInner}>
        <div className={styles.scanLine} aria-hidden="true" />
        <div className={styles.formHeader}>
          <div>
            <span>{dictionary.eyebrow}</span>
            <h3>{dictionary.title}</h3>
            <p>{dictionary.description}</p>
          </div>
          <button
            className={styles.formClose}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={dictionary.closeLabel}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form
          ref={formRef}
          className={styles.projectForm}
          onSubmit={handleSubmit}
          onChange={markDirty}
          noValidate
        >
          <fieldset disabled={!isOpen || isSubmitting}>
            <legend className={styles.srOnly}>{dictionary.legend}</legend>
            <input name="locale" type="hidden" value={locale} />
            <div className={styles.formColumns}>
              <section aria-labelledby={`identity-title-${formId}`}>
                <div className={styles.formSectionTitle}>
                  <span aria-hidden="true">01</span>
                  <h4 id={`identity-title-${formId}`}>{dictionary.identityTitle}</h4>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`name-${formId}`}>
                    {dictionary.name} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id={`name-${formId}`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={FIELD_LIMITS.name}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`email-${formId}`}>
                    {dictionary.email} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={`email-${formId}`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={FIELD_LIMITS.email}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`phone-${formId}`}>
                    {dictionary.phone} <small>{dictionary.optional}</small>
                  </label>
                  <input
                    id={`phone-${formId}`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={FIELD_LIMITS.phone}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`company-${formId}`}>
                    {dictionary.company} <small>{dictionary.optional}</small>
                  </label>
                  <input
                    id={`company-${formId}`}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    maxLength={FIELD_LIMITS.company}
                  />
                </div>
              </section>

              <section aria-labelledby={`project-title-${formId}`}>
                <div className={styles.formSectionTitle}>
                  <span aria-hidden="true">02</span>
                  <h4 id={`project-title-${formId}`}>{dictionary.ideaTitle}</h4>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`projectType-${formId}`}>{dictionary.projectType}</label>
                  <select
                    ref={projectTypeRef}
                    id={`projectType-${formId}`}
                    name="projectTypeId"
                    defaultValue={initialProjectTypeId}
                    required
                  >
                    {projectTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor={`message-${formId}`}>
                    {dictionary.message} <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id={`message-${formId}`}
                    name="message"
                    rows={7}
                    required
                    minLength={20}
                    maxLength={FIELD_LIMITS.message}
                    aria-describedby={`message-help-${formId}`}
                  />
                  <small id={`message-help-${formId}`}>
                    {dictionary.messageHelp}
                  </small>
                </div>
              </section>
            </div>

            <div className={styles.uploadSection}>
              <div
                className={styles.dropZone}
                data-dragging={isDragging}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setIsDragging(false);
                  }
                }}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id={`files-${formId}`}
                  className={styles.fileInput}
                  type="file"
                  accept={FILE_RULES.accept}
                  multiple
                  onChange={handleFileChange}
                  aria-describedby={`file-rules-${formId} file-error-${formId}`}
                />
                <span className={styles.uploadIcon} aria-hidden="true">＋</span>
                <div>
                  <strong>{dictionary.uploadTitle}</strong>
                  <p>{dictionary.uploadDescription}</p>
                  <small id={`file-rules-${formId}`}>
                    {dictionary.uploadRules}
                  </small>
                </div>
              </div>

              <p
                id={`file-error-${formId}`}
                className={styles.fieldError}
                role="alert"
              >
                {fileError}
              </p>

              {selectedFiles.length > 0 && (
                <ul className={styles.fileList} aria-label={dictionary.selectedFiles}>
                  {selectedFiles.map(({ file, id, previewUrl }) => (
                    <li key={id}>
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="" />
                      ) : (
                        <span className={styles.fileType} aria-hidden="true">
                          {file.name.split(".").pop()?.slice(0, 4).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <strong>{file.name}</strong>
                        <small>
                          {file.type || dictionary.unknownType} ·{" "}
                          {formatFileSize(file.size)}
                        </small>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(id)}
                        aria-label={`${file.name} ${dictionary.removeFile}`}
                      >
                        {dictionary.remove}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor={`website-${formId}`}>{dictionary.website}</label>
              <input
                id={`website-${formId}`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <label className={styles.consent}>
              <input name="consent" type="checkbox" value="accepted" required />
              <span>
                {dictionary.consent} <b aria-hidden="true">*</b>
              </span>
            </label>

            <div className={styles.formActions}>
              <div
                className={styles.formStatus}
                data-status={submitState.type}
                role={submitState.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {submitState.message && (
                  <>
                    <span aria-hidden="true">
                      {submitState.type === "success" ? "✓" : "!"}
                    </span>
                    <p>{submitState.message}</p>
                  </>
                )}
              </div>
              <button
                className={`${styles.action} ${styles.actionPrimary} ${styles.submitButton}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.submitSpinner} aria-hidden="true" />
                    {dictionary.submitting}
                  </>
                ) : (
                  <>
                    {dictionary.submit} <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

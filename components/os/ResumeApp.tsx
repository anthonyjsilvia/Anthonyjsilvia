"use client";

import ContactMeForm from "@/components/ContactMeForm";
import { resumeRequestCopy } from "@/lib/resume-request";

/** Request Resume — no live document or PDF inside AnthonyOS. */
export default function ResumeApp({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={`os-app os-app--single${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-app__single os-app__single--narrow">
        <p className="os-app__eyebrow">{resumeRequestCopy.eyebrow}</p>
        <h1 className="os-app__single-title">{resumeRequestCopy.title}</h1>
        <p className="os-app__lede">{resumeRequestCopy.lede}</p>
        <div className="os-app__form">
          <ContactMeForm
            fallbackEmail={resumeRequestCopy.fallbackEmail}
            heading={resumeRequestCopy.formHeading}
            description={resumeRequestCopy.formDescription}
            defaultSubject={resumeRequestCopy.defaultSubject}
            defaultCategory={resumeRequestCopy.defaultCategory}
            defaultBody={resumeRequestCopy.defaultBody}
            lockSubject
            hideCategory
            submitLabel={resumeRequestCopy.submitLabel}
            successTitle={resumeRequestCopy.successTitle}
            successMessage={resumeRequestCopy.successMessage}
            successActionLabel={resumeRequestCopy.successActionLabel}
          />
        </div>
      </div>
    </div>
  );
}

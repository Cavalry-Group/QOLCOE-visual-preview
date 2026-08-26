const conceptServices = {
  consultancy: { title: 'Consultancy', label: 'Start with understanding', copy: 'Specialist advice and embedded support shaped around the needs of people, teams and organisations.', link: 'consultancy.html', cta: 'Explore consultancy' },
  training: { title: 'Training', label: 'Workforce development', copy: 'Practical, evidence-based learning designed to build confidence and translate directly into everyday practice.', link: 'training.html', cta: 'Explore training' },
  pbs: { title: 'Positive Behaviour Support', label: 'Person-centred practice', copy: 'Support that understands behaviour, addresses unmet need and improves quality-of-life outcomes.', link: 'enquire.html', cta: 'Enquire about PBS' },
  fba: { title: 'Functional Behavioural Assessment', label: 'Understand before acting', copy: 'Structured assessment that clarifies why behaviour occurs and turns that understanding into ethical, effective support.', link: 'enquire.html', cta: 'Enquire about assessment' },
  homes: { title: 'Homes, Not Hospitals', label: 'National Transforming Care priority', copy: 'Dedicated transition support helping people move from hospital and secure settings into dignified community homes.', items: ['Multi-disciplinary discharge planning', 'Capable environment design', 'Bespoke team formulation', 'Placement breakdown prevention'], link: 'enquire.html', cta: 'Enquire about hospital transition' },
  rapid: { title: 'Rapid Stabilisation', label: 'Emergency outreach', copy: 'High-intensity PBS and therapeutic intervention for placements at risk of breakdown or emergency admission.', items: ['Crisis de-escalation', 'Interim safety planning', 'Side-by-side team coaching', 'Sustainable placement recovery'], link: 'enquire.html', cta: 'Talk to the rapid response team' },
  clinical: { title: 'Clinical Assessments', label: 'Neuro-affirming pathways', copy: 'Evidence-based assessments for children and adults, providing clear insight into strengths, needs and next steps.', items: ['ADHD assessment', 'Autism assessment', 'Sleep assessment'], link: 'enquire.html', cta: 'Enquire about an assessment' },
  academy: { title: 'Skills Academy', label: 'Structured development', copy: 'Learning pathways that strengthen capability, leadership and confidence across the care and support workforce.', link: 'skills-academy.html', cta: 'Explore Skills Academy' },
  organisation: { title: 'Organisational Development', label: 'Culture & systems change', copy: 'Whole-organisation development aligning leadership, governance, culture and systems around better outcomes.', link: 'enquire.html', cta: 'Discuss organisational change' },
  property: { title: 'Property', label: 'Enabling environments', copy: 'Property search, suitability and risk support focused on creating environments for stability, inclusion and independence.', link: 'enquire.html', cta: 'Enquire about property' }
};

const conceptModal = document.querySelector('[data-concept-modal]');
let conceptOpener;

const closeConceptModal = () => {
  if (!conceptModal?.classList.contains('is-open')) return;
  conceptModal.classList.remove('is-open');
  conceptModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('concept-modal-open');
  conceptOpener?.focus();
};

document.querySelectorAll('[data-concept-service]').forEach((button, index) => {
  button.style.setProperty('--concept-delay', `${Math.min(index * 70, 650)}ms`);
  button.style.setProperty('--concept-index', index);
  button.addEventListener('click', () => {
    const service = conceptServices[button.dataset.conceptService];
    if (!service || !conceptModal) return;
    conceptOpener = button;
    conceptModal.querySelector('[data-concept-label]').textContent = service.label;
    conceptModal.querySelector('#concept-modal-title').textContent = service.title;
    conceptModal.querySelector('[data-concept-copy]').textContent = service.copy;
    const list = conceptModal.querySelector('[data-concept-items]');
    list.replaceChildren();
    (service.items || []).forEach((item) => {
      const li = document.createElement('li'); li.textContent = item; list.append(li);
    });
    list.hidden = !service.items?.length;
    const link = conceptModal.querySelector('[data-concept-link]');
    link.href = `https://qolcoe-website.vercel.app/${service.link}`; link.textContent = service.cta;
    conceptModal.classList.add('is-open');
    conceptModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('concept-modal-open');
    conceptModal.querySelector('[data-concept-close]').focus();
  });
});

conceptModal?.querySelectorAll('[data-concept-close]').forEach((item) => item.addEventListener('click', closeConceptModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeConceptModal(); });

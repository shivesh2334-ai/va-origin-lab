# VA Origin Lab

An interactive clinician-education application for anatomy-based localization of idiopathic ventricular arrhythmias from the 12-lead ECG.

## Features

- Guided regional localizer using axis, V1 morphology, precordial transition, QRS width and lead-I polarity
- Morphology atlas for common ventricular arrhythmia origins
- Four worked cases with differential diagnoses and explicit uncertainty
- V2 transition-ratio and V2S/V3R calculators
- Curated evidence library with primary validation studies and guidelines
- Responsive, accessible, dependency-light Vite/React interface

## Clinical scope

This is an educational tool. It predicts a probable anatomical region, not a definitive focus or ablation target. Findings require correlation with clinical assessment, imaging and electrophysiology mapping.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

The repository is Vercel-ready. Import it as a Vite project; no environment variables are required.

```bash
npm run build
```

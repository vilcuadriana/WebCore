# WebCore – Aplicație web pentru gestionarea notițelor de curs și seminare

## Obiectiv
Realizarea unei aplicații web care să permită studenților gestionarea notițelor luate la cursuri și seminare.

## Descriere
Aplicația trebuie să permită studentului organizarea notițelor în funcție de materiile la care participă, precum și de activitățile sale de studiu individual. Platforma va utiliza o arhitectură de tip Single Page Application (SPA) și va fi accesibilă prin intermediul unui browser web de pe computer, dispozitive mobile sau tablete, conform preferințelor utilizatorului. Editorul de notițe trebuie să fie ușor de folosit pentru a permite luarea de notițe în timpul cursurilor și seminarelor. De asemenea, acesta va suporta sintaxa Markdown pentru a facilita formatarea simplă a textului.

## Funcționalități minime
- Autentificare cu contul instituțional (@stud.ase.ro) pentru gestionarea notițelor.
- Vizualizare, adăugare, editare și ștergere a notițelor.
- Posibilitatea de a adăuga atașamente (imagini, documente) la notițe.
- Organizarea notițelor după materie, dată, etichete (tag-uri) și cuvinte-cheie.
- Partajarea notițelor cu colegii.
- Integrarea de conținut din alte surse (ex: YouTube, Kindle, conferințe online) pentru luarea de notițe concomitent.
- Organizarea grupurilor de studiu, invitarea colegilor și partajarea notițelor în cadrul grupului.

## Exemple de platforme similare
- **StuDocu** – platformă online pentru partajarea notițelor și materialelor de curs între studenți.  
- **Evernote** – aplicație populară pentru luarea și organizarea notițelor.

## Tehnologii utilizate
- Frontend: React.js (SPA)
- Backend: Node.js + Express + REST API
- Bază de date: PostgreSQL + Sequelize (ORM)
- Posibil deploy pe Azure, AWS sau alt serviciu free-tier

---

# 📌 Planul proiectului

## 1. Arhitectură generală
Proiectul va fi structurat în două componente principale:
- **Frontend (React.js)**
  - Aplicație SPA cu React Router, Axios și componente reutilizabile.
  - Editor Markdown pentru notițe.
  - Interfață pentru managementul materiilor, notițelor, grupurilor și atașamentelor.
- **Backend (Node.js + Express)**
  - API RESTful pentru autentificare, CRUD pentru notițe și materii, gestiune grupuri, partajare resurse.
  - Integrare cu YouTube API pentru căutarea de resurse externe.
  - Validare date și management acces cu JWT.

Baza de date PostgreSQL va fi accesată prin ORM-ul Sequelize, cu modele, relații și migrări dedicate.

---

## 2. Module principale ale aplicației

### 2.1. Modul Autentificare
- Înregistrare utilizator (@stud.ase.ro)
- Login, logout
- Generare și validare token JWT
- Protejarea rutelor backend prin middleware

### 2.2. Modul Materii (Subjects)
- Adăugare, listare, editare, ștergere materii
- Legarea notițelor de materii

### 2.3. Modul Notițe
- Editor Markdown
- CRUD complet
- Filtrare după materie, tag-uri, date
- Atașamente (imagini, PDF, documente)
- Salvarea resurselor externe (ex: link YouTube)

### 2.4. Modul Tag-uri
- Adăugare / asociere tag-uri cu notele
- Filtrare după tag-uri

### 2.5. Modul Grupuri de studiu
- Creare grup
- Invitare membri
- Atribuire roluri (owner, member)
- Partajare notițe în cadrul grupului

### 2.6. Modul Partajare notițe
- Partajare cu un utilizator individual
- Permisiuni (vizualizare / editare)

### 2.7. Modul Integrare YouTube
- Căutare clipuri
- Returnare metadate video (titlu, thumbnail, link)
- Salvare resursă externă atașată unei notițe

---

## 3. Structura bazei de date (rezumat)
Tabele principale:
- **users** – utilizatori ai aplicației  
- **subjects** – materii definite de utilizator  
- **notes** – notițe în format Markdown  
- **attachments** – fișiere asociate notițelor  
- **tags**, **note_tags** – sistem de etichete  
- **study_groups** – grupuri de studiu  
- **group_members** – membri ai grupurilor  
- **note_shares** – partajări individuale sau pe grup  
- **external_resources** – linkuri și materiale din surse externe  

---

## 4. Plan de implementare

### Etapa 1 – Inițializare proiect (până la 16.11.2025)
- Crearea repository-ului Git  
- Structura inițială a backend-ului și frontend-ului  
- Documentația proiectului (acest document)  
- Modele + migrări pentru useri, materii și notițe  

### Etapa 2 – API REST funcțional (până la 06.12.2025)
- Implementarea autentificării  
- CRUD pentru materii și notițe  
- Implementare endpoint YouTube search  
- Testarea locală + instrucțiuni de rulare în README  
- Upload fișiere pentru atașamente  

### Etapa 3 – Aplicație completă + demo (ultimul seminar)
- Implementarea frontend complet (toate paginile)  
- Sistem de partajare + grupuri de studiu  
- Filtrare, căutare, tag-uri  
- Editor Markdown funcțional  
- Integrare completă cu API-ul backend  
- Testare end-to-end și fixare bug-uri  
- Deploy frontend + backend + baza de date  
- Pregătire demo final  

---

## 5. Managementul versiuni (Git)
- Branch principal: `main`  
- Branch-uri pentru funcționalități: `feature/auth`, `feature/notes`, etc.  
- Commit-uri incrementale, cu mesaje clare:  
  - `feat: add notes CRUD`  
  - `fix: attachment upload error`  
  - `chore: update README`  

---

## 6. Deploy
Se recomandă:  
- **Backend:** Render / Railway / Azure  
- **Frontend:** Vercel / Netlify  
- **Bază de date:** PostgreSQL (Railway / Supabase / Azure)  

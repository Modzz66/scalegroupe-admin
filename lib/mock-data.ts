export type Role = 'ADMIN' | 'KUNDE'

export interface User {
  id: string; name: string; email: string; password: string; role: Role; kundeId?: string
}
export interface Kunde {
  id: string; name: string; email: string; telefon: string; unternehmen: string
  paket: string; umsatz: number; status: 'Aktiv' | 'Inaktiv'; seit: string; avatar: string
}
export interface Projekt {
  id: string; name: string; kundeId: string; kundeName: string; paket: string
  status: 'Offen'|'In Bearbeitung'|'Review / Feedback'|'Abgeschlossen'|'Pausiert'|'Storniert'
  deadline: string; budget: number; fortschritt: number; beschreibung: string
  verantwortlich: string; erstellt: string
}
export interface Rechnung {
  id: string; nummer: string; kundeId: string; kundeName: string; paket: string
  betrag: number; status: 'Bezahlt'|'Ausstehend'|'Überfällig'|'Entwurf'
  datum: string; faellig: string; beschreibung: string
}
export interface Lead {
  id: string; name: string; email: string; telefon: string; unternehmen: string
  interesse: string; nachricht: string; datum: string
  status: 'Neu'|'Kontaktiert'|'Qualifiziert'|'Verloren'
}
export interface Aufgabe {
  id: string; titel: string; beschreibung: string; projektId: string; projektName: string
  verantwortlich: string; prioritaet: 'Hoch'|'Mittel'|'Niedrig'
  status: 'Todo'|'In Arbeit'|'Review'|'Fertig'; faellig: string
}
export interface Termin {
  id: string; titel: string; datum: string; uhrzeit: string; typ: string; kundeId?: string
}

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Offen':             { bg:'bg-blue-500/15',   text:'text-blue-400',   dot:'bg-blue-400'   },
  'In Bearbeitung':    { bg:'bg-amber-500/15',  text:'text-amber-400',  dot:'bg-amber-400'  },
  'Review / Feedback': { bg:'bg-purple-500/15', text:'text-purple-300', dot:'bg-purple-300' },
  'Abgeschlossen':     { bg:'bg-emerald-500/15',text:'text-emerald-400',dot:'bg-emerald-400'},
  'Pausiert':          { bg:'bg-gray-500/15',   text:'text-gray-400',   dot:'bg-gray-400'   },
  'Storniert':         { bg:'bg-red-500/15',    text:'text-red-400',    dot:'bg-red-400'    },
  'Bezahlt':           { bg:'bg-emerald-500/15',text:'text-emerald-400',dot:'bg-emerald-400'},
  'Ausstehend':        { bg:'bg-amber-500/15',  text:'text-amber-400',  dot:'bg-amber-400'  },
  'Überfällig':        { bg:'bg-red-500/15',    text:'text-red-400',    dot:'bg-red-400'    },
  'Entwurf':           { bg:'bg-gray-500/15',   text:'text-gray-400',   dot:'bg-gray-400'   },
  'Neu':               { bg:'bg-purple-500/15', text:'text-purple-300', dot:'bg-purple-300' },
  'Kontaktiert':       { bg:'bg-blue-500/15',   text:'text-blue-400',   dot:'bg-blue-400'   },
  'Qualifiziert':      { bg:'bg-emerald-500/15',text:'text-emerald-400',dot:'bg-emerald-400'},
  'Verloren':          { bg:'bg-red-500/15',    text:'text-red-400',    dot:'bg-red-400'    },
}

export const USERS: User[] = [
  { id:'u1', name:'Enes Gökgül',      email:'enes@scalegroupe.de',   password:'admin123', role:'ADMIN' },
  { id:'u2', name:'Kevin Ochs',       email:'kevin@scalegroupe.de',  password:'team123',  role:'ADMIN' },
  { id:'u3', name:'Damian Rzepa',     email:'damian@scalegroupe.de', password:'team123',  role:'ADMIN' },
  { id:'u4', name:'Klaus Müller',     email:'mueller@baeckerei.de',  password:'kunde123', role:'KUNDE', kundeId:'k1' },
  { id:'u5', name:'Sarah M.',         email:'sarah@sportgear24.de',  password:'kunde123', role:'KUNDE', kundeId:'k2' },
  { id:'u6', name:'Dr. Thomas Weber', email:'weber@zahnarzt.de',     password:'kunde123', role:'KUNDE', kundeId:'k3' },
]
export const KUNDEN: Kunde[] = [
  { id:'k1', name:'Klaus Müller',     email:'mueller@baeckerei.de', telefon:'+49 711 123456', unternehmen:'Bäckerei Müller',        paket:'Pro-Paket',           umsatz:4900,  status:'Aktiv',   seit:'2024-01', avatar:'KM' },
  { id:'k2', name:'Sarah M.',         email:'sarah@sportgear24.de', telefon:'+49 89 654321',  unternehmen:'SportGear24',             paket:'Premium-Paket',       umsatz:12400, status:'Aktiv',   seit:'2024-02', avatar:'SM' },
  { id:'k3', name:'Dr. Thomas Weber', email:'weber@zahnarzt.de',    telefon:'+49 69 789012',  unternehmen:'Zahnarztpraxis Dr. Weber',paket:'Starter-Paket',       umsatz:2100,  status:'Aktiv',   seit:'2024-03', avatar:'TW' },
  { id:'k4', name:'Lena K.',          email:'lena@fashionloop.de',  telefon:'+49 30 345678',  unternehmen:'FashionLoop',             paket:'Marketing-Retainer',  umsatz:8700,  status:'Aktiv',   seit:'2024-03', avatar:'LK' },
  { id:'k5', name:'Marco F.',         email:'marco@techstart.de',   telefon:'+49 40 901234',  unternehmen:'TechStart GmbH',          paket:'Premium-Paket',       umsatz:9800,  status:'Aktiv',   seit:'2024-04', avatar:'MF' },
  { id:'k6', name:'Peter H.',         email:'peter@logipro.de',     telefon:'+49 621 567890', unternehmen:'LogiPro Logistics',       paket:'Pro-Paket',           umsatz:5600,  status:'Inaktiv', seit:'2024-02', avatar:'PH' },
]
export const PROJEKTE: Projekt[] = [
  { id:'p1', name:'Website Relaunch',   kundeId:'k1', kundeName:'Bäckerei Müller', paket:'Pro-Paket',          status:'Abgeschlossen',     deadline:'2024-03-15', budget:2499, fortschritt:100, beschreibung:'Kompletter Website-Relaunch mit Online-Shop.',                verantwortlich:'Enes Gökgül',  erstellt:'2024-01-10' },
  { id:'p2', name:'Shopify Redesign',   kundeId:'k2', kundeName:'SportGear24',     paket:'Premium-Paket',      status:'Abgeschlossen',     deadline:'2024-04-01', budget:4900, fortschritt:100, beschreibung:'E-Commerce Redesign mit CRO-Optimierung.',                    verantwortlich:'Kevin Ochs',   erstellt:'2024-02-01' },
  { id:'p3', name:'Praxis-Website',     kundeId:'k3', kundeName:'Dr. Weber',       paket:'Starter-Paket',      status:'Abgeschlossen',     deadline:'2024-04-20', budget:999,  fortschritt:100, beschreibung:'Moderne Praxis-Website mit Doctolib.',                        verantwortlich:'Damian Rzepa', erstellt:'2024-03-01' },
  { id:'p4', name:'Instagram Marketing',kundeId:'k4', kundeName:'FashionLoop',     paket:'Marketing-Retainer', status:'In Bearbeitung',    deadline:'2024-12-31', budget:1200, fortschritt:65,  beschreibung:'Monatliches Instagram & Meta Ads Management.',               verantwortlich:'Kevin Ochs',   erstellt:'2024-03-15' },
  { id:'p5', name:'SaaS Landing Page',  kundeId:'k5', kundeName:'TechStart GmbH',  paket:'Premium-Paket',      status:'Review / Feedback', deadline:'2024-06-30', budget:4900, fortschritt:85,  beschreibung:'Moderne SaaS-Landingpage mit Investor-Bereich.',             verantwortlich:'Enes Gökgül',  erstellt:'2024-04-01' },
  { id:'p6', name:'SEO & Content',      kundeId:'k6', kundeName:'LogiPro',         paket:'Pro-Paket',          status:'Pausiert',          deadline:'2024-07-15', budget:2499, fortschritt:40,  beschreibung:'SEO-Optimierung und Content-Strategie.',                     verantwortlich:'Damian Rzepa', erstellt:'2024-04-10' },
]
export const RECHNUNGEN: Rechnung[] = [
  { id:'r1', nummer:'RE-2024-001', kundeId:'k1', kundeName:'Bäckerei Müller', paket:'Pro-Paket',         betrag:2499, status:'Bezahlt',    datum:'2024-01-15', faellig:'2024-02-15', beschreibung:'Website Relaunch – Pro-Paket' },
  { id:'r2', nummer:'RE-2024-002', kundeId:'k2', kundeName:'SportGear24',     paket:'Premium-Paket',     betrag:4900, status:'Bezahlt',    datum:'2024-02-01', faellig:'2024-03-01', beschreibung:'Shopify Redesign – Premium-Paket' },
  { id:'r3', nummer:'RE-2024-003', kundeId:'k3', kundeName:'Dr. Weber',       paket:'Starter-Paket',     betrag:999,  status:'Bezahlt',    datum:'2024-03-05', faellig:'2024-04-05', beschreibung:'Praxis-Website – Starter-Paket' },
  { id:'r4', nummer:'RE-2024-004', kundeId:'k4', kundeName:'FashionLoop',     paket:'Marketing-Retainer',betrag:1200, status:'Bezahlt',    datum:'2024-03-01', faellig:'2024-04-01', beschreibung:'Marketing Retainer März' },
  { id:'r5', nummer:'RE-2024-005', kundeId:'k5', kundeName:'TechStart GmbH',  paket:'Premium-Paket',     betrag:4900, status:'Ausstehend', datum:'2024-05-01', faellig:'2024-06-01', beschreibung:'SaaS Landing Page – Premium-Paket' },
  { id:'r6', nummer:'RE-2024-006', kundeId:'k4', kundeName:'FashionLoop',     paket:'Marketing-Retainer',betrag:1200, status:'Überfällig', datum:'2024-04-01', faellig:'2024-05-01', beschreibung:'Marketing Retainer April' },
  { id:'r7', nummer:'ANG-2024-001',kundeId:'k6', kundeName:'LogiPro',         paket:'Pro-Paket',         betrag:2499, status:'Entwurf',    datum:'2024-05-10', faellig:'2024-06-10', beschreibung:'SEO & Content – Pro-Paket (Angebot)' },
]
export const LEADS: Lead[] = [
  { id:'l1', name:'Thomas Bauer',  email:'t.bauer@gastro-bauer.de',  telefon:'+49 711 999001', unternehmen:'Gastro Bauer GmbH',       interesse:'Pro-Paket',          nachricht:'Wir brauchen dringend eine neue Website für unser Restaurant. Budget vorhanden.',     datum:'2024-05-20', status:'Neu'         },
  { id:'l2', name:'Anna Schmidt',  email:'schmidt@anna-coaching.de', telefon:'+49 89 999002',  unternehmen:'Anna Schmidt Coaching',   interesse:'Starter-Paket',      nachricht:'Ich suche eine einfache Website für mein Coaching-Business.',                        datum:'2024-05-19', status:'Kontaktiert' },
  { id:'l3', name:'Michael Weber', email:'m.weber@autohaus-weber.de',telefon:'+49 621 999003', unternehmen:'Autohaus Weber',          interesse:'Premium-Paket',      nachricht:'Unser Autohaus braucht eine komplette digitale Transformation.',                      datum:'2024-05-18', status:'Qualifiziert'},
  { id:'l4', name:'Julia Braun',   email:'julia@braun-fitness.de',   telefon:'+49 30 999004',  unternehmen:'Braun Fitness Studio',    interesse:'Marketing-Retainer', nachricht:'Wir möchten mehr Kunden über Social Media gewinnen.',                                 datum:'2024-05-17', status:'Neu'         },
]
export const AUFGABEN: Aufgabe[] = [
  { id:'a1', titel:'Hero-Sektion designen',        beschreibung:'Neues Hero mit Video Background',    projektId:'p5', projektName:'TechStart Landing Page', verantwortlich:'Enes Gökgül',  prioritaet:'Hoch',   status:'In Arbeit', faellig:'2024-05-25' },
  { id:'a2', titel:'Pricing-Sektion texten',       beschreibung:'3 Pakete ausformulieren',            projektId:'p5', projektName:'TechStart Landing Page', verantwortlich:'Kevin Ochs',   prioritaet:'Mittel', status:'Todo',      faellig:'2024-05-28' },
  { id:'a3', titel:'Meta Ads Kampagne optimieren', beschreibung:'A/B-Test für FashionLoop Reels',     projektId:'p4', projektName:'Instagram Marketing',    verantwortlich:'Kevin Ochs',   prioritaet:'Hoch',   status:'In Arbeit', faellig:'2024-05-22' },
  { id:'a4', titel:'Kundenfeedback einarbeiten',   beschreibung:'Änderungswünsche von TechStart',    projektId:'p5', projektName:'TechStart Landing Page', verantwortlich:'Enes Gökgül',  prioritaet:'Hoch',   status:'Review',    faellig:'2024-05-24' },
  { id:'a5', titel:'LogiPro SEO-Analyse',          beschreibung:'Keyword-Recherche abschließen',      projektId:'p6', projektName:'SEO & Content',          verantwortlich:'Damian Rzepa', prioritaet:'Niedrig',status:'Todo',      faellig:'2024-06-01' },
  { id:'a6', titel:'Rechnung TechStart erstellen', beschreibung:'RE-2024-005 versenden',              projektId:'p5', projektName:'TechStart Landing Page', verantwortlich:'Damian Rzepa', prioritaet:'Hoch',   status:'Fertig',    faellig:'2024-05-01' },
]
export const TERMINE: Termin[] = [
  { id:'t1', titel:'Kick-off Call – TechStart',    datum:'2024-05-22', uhrzeit:'10:00', typ:'Call',    kundeId:'k5' },
  { id:'t2', titel:'Design Review – FashionLoop',  datum:'2024-05-23', uhrzeit:'14:00', typ:'Meeting', kundeId:'k4' },
  { id:'t3', titel:'Rechnung versenden – Weber',   datum:'2024-05-24', uhrzeit:'09:00', typ:'Aufgabe', kundeId:'k3' },
  { id:'t4', titel:'Team Weekly',                  datum:'2024-05-27', uhrzeit:'09:00', typ:'Intern' },
  { id:'t5', titel:'Neues Angebot – Gastro Bauer', datum:'2024-05-28', uhrzeit:'11:00', typ:'Call' },
]
export const UMSATZ_MONATLICH = [
  { monat:'Jan', umsatz:2499 }, { monat:'Feb', umsatz:4900 },
  { monat:'Mär', umsatz:4199 }, { monat:'Apr', umsatz:6100 },
  { monat:'Mai', umsatz:8300 }, { monat:'Jun', umsatz:0 },
]
export const LEADS_WOECHENTLICH = [
  { woche:'KW18', leads:2 }, { woche:'KW19', leads:4 },
  { woche:'KW20', leads:1 }, { woche:'KW21', leads:3 },
]
export const MOCK_DATEIEN = [
  { id:'d1', name:'Angebot_Bäckerei_Müller.pdf',   typ:'pdf', groesse:'245 KB', datum:'2024-01-12', kundeId:'k1', ordner:'Verträge'       },
  { id:'d2', name:'Design_SportGear24_v2.fig',      typ:'fig', groesse:'18 MB',  datum:'2024-02-20', kundeId:'k2', ordner:'Designs'        },
  { id:'d3', name:'RE-2024-001.pdf',                typ:'pdf', groesse:'128 KB', datum:'2024-01-15', kundeId:'k1', ordner:'Rechnungen'     },
  { id:'d4', name:'Präsentation_TechStart.pptx',   typ:'ppt', groesse:'4.2 MB', datum:'2024-04-15', kundeId:'k5', ordner:'Präsentationen' },
  { id:'d5', name:'Vertrag_FashionLoop.pdf',        typ:'pdf', groesse:'312 KB', datum:'2024-03-10', kundeId:'k4', ordner:'Verträge'       },
  { id:'d6', name:'Logo_Zahnarztpraxis.zip',        typ:'zip', groesse:'8.7 MB', datum:'2024-03-25', kundeId:'k3', ordner:'Designs'        },
  { id:'d7', name:'RE-2024-005.pdf',                typ:'pdf', groesse:'134 KB', datum:'2024-05-01', kundeId:'k5', ordner:'Rechnungen'     },
  { id:'d8', name:'Content_Plan_LogiPro.docx',      typ:'doc', groesse:'892 KB', datum:'2024-04-20', kundeId:'k6', ordner:'Präsentationen' },
]

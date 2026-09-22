import React,{useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Activity,BookOpen,Calculator,ChevronRight,ExternalLink,HeartPulse,Info,RotateCcw,ShieldAlert,Target}from'lucide-react';
import'./style.css';

const sites=[
['RVOT','LBBB · inferior axis','Transition usually V3–V5; free-wall sites often later.'],
['LVOT / aortic root','Early transition','Often V1–V2; septal sites can mimic RVOT.'],
['Mitral annulus','RBBB · concordance','Axis varies by anterior, lateral, or inferior site.'],
['Tricuspid annulus','LBBB','Lateral sites transition later; septal sites are narrower.'],
['LV summit','Early transition / concordance','Initial slur or epicardial indices may be present.'],
['Cardiac crux','LBBB · left-superior','Early V2 transition, deep inferior QS; S>R in V6 is suggestive.'],
['Para-Hisian','Narrow, often <130 ms','LBBB/QS in V1; positive I and aVL.'],
['Papillary muscle','RBBB · broad','Dominant R in V1, often broad (~150 ms) and later transition.'],
['Fascicular','Relatively narrow · RBBB','Axis helps identify anterior vs posterior fascicle.'],
['Moderator band / RV PM','LBBB · left-superior','Late transition; consider RV intracavitary structures.']
];

const cases=[
{title:'Classic outflow pattern',stem:'Monomorphic PVC: LBBB in V1, positive II/III/aVF, positive lead I, transition at V5; sinus transition V3.',answer:'RVOT, likely free-wall region',why:['Inferior axis points away from a superior outflow focus.','LBBB morphology supports initial RV-to-LV activation.','PVC transition later than sinus rhythm strongly favors RVOT.','Very late transition makes an RVOT free-wall site more likely.'],alt:'Tricuspid annulus is a competing LBBB/late-transition site; correlate with detailed inferior-lead and annular morphology.'},
{title:'The difficult V3 transition',stem:'PVC: LBBB/inferior axis with transition in V3. V2 PVC R=4 mm, S=6 mm; sinus V2 R=8 mm, S=2 mm.',answer:'Outflow tract; RVOT somewhat favored',why:['V3 transition alone is indeterminate.','V2 transition ratio = (4/10) ÷ (8/10) = 0.50, below the ~0.60 LVOT threshold.','The index therefore favors RVOT, but does not establish the site.','If lead I/V1 or V2S/V3R favor LVOT, map both adjacent outflow structures.'],alt:'Adjacent septal RVOT and aortic-root/LVOT sites can look almost identical. Report the regional estimate and its uncertainty.',corrected:true},
{title:'Conduction-system clue',stem:'PVC: QRS 118 ms, RBBB-like V1, left-superior axis; no initial slur.',answer:'Left posterior fascicular region',why:['RBBB-like morphology indicates a left-ventricular origin.','Left-superior axis matches activation from the posterior fascicular region.','A QRS <130 ms suggests rapid access to the specialized conduction system.','Lack of initial slur makes an epicardial source less likely.'],alt:'Posteromedial papillary muscle can share the axis and RBBB pattern, but usually produces a broader QRS.'},
{title:'Epicardial warning',stem:'PVC: dominant R in V1, very early transition, positive precordial concordance, initial slurring and prolonged intrinsicoid deflection.',answer:'LV summit / epicardial region',why:['Very early positivity suggests a leftward outflow or summit site.','Initial slow activation before rapid ventricular spread is an epicardial clue.','Positive concordance is compatible with summit or mitral-annular origins.','The predicted region warns of proximity to coronary arteries and possible procedural complexity.'],alt:'Aortic–mitral continuity and anterior mitral annulus remain alternatives; mapping and coronary imaging establish the target.'}
];

const refs=[
['Enriquez et al. — anatomy-based 12-lead method','https://pubmed.ncbi.nlm.nih.gov/30953761/','Heart Rhythm, 2019'],
['Muser et al. — diagnosis and treatment of idiopathic PVCs','https://pmc.ncbi.nlm.nih.gov/articles/PMC8534438/','Open-access clinical review'],
['2022 ESC ventricular-arrhythmia guideline','https://academic.oup.com/eurheartj/article/43/40/3997/6675633','European Heart Journal'],
['Betensky et al. — V2 transition ratio','https://pubmed.ncbi.nlm.nih.gov/21616286/','JACC, original validation'],
['Yoshida et al. — V2S/V3R index','https://pubmed.ncbi.nlm.nih.gov/24612087/','JCE, original validation'],
['Tsiachris et al. — ECG characteristics and mapping','https://pmc.ncbi.nlm.nih.gov/articles/PMC10572222/','Open-access review']
];

function Localizer(){
 const [axis,setAxis]=useState('inferior'),[v1,setV1]=useState('lbbb'),[trans,setTrans]=useState('v4plus'),[width,setWidth]=useState('broad'),[lead1,setLead1]=useState('positive'),[slur,setSlur]=useState(false);
 const result=useMemo(()=>{
  let label='RVOT region',confidence='Moderate',notes=[];
  if(axis==='superior'&&v1==='rbbb'){label=width==='narrow'?'Fascicular region':'Papillary muscle / inferior LV';notes.push('Use fascicular axis and QRS width to separate these neighbors.');}
  else if(axis==='superior'&&v1==='lbbb'){label=trans==='v2early'?'Cardiac crux':'Moderator band / RV papillary muscle';notes.push('Check inferior QS and the R/S relation in V6.');}
  else if(v1==='rbbb'){label=trans==='v2early'?'LV summit / aortic–mitral continuity':'Mitral annulus or papillary muscle';notes.push('Positive concordance and initial forces refine this branch.');}
  else if(trans==='v2early'){label='LVOT / aortic root region';notes.push('Inspect V1 morphology and lead I; adjacent septal RVOT can mimic this.');}
  else if(trans==='v3'){label='Indeterminate outflow tract';confidence='Low–moderate';notes.push('Calculate V2 transition ratio and V2S/V3R; compare with sinus transition.');}
  if(width==='narrow'){notes.push('Narrow QRS raises para-Hisian or fascicular proximity.');confidence='Moderate';}
  if(slur){notes.push('Initial slur raises epicardial/intramural suspicion.');confidence='Cautious';}
  if(lead1==='negative'&&axis==='inferior')notes.push('Negative lead I shifts attention leftward/anteriorly.');
  return{label,confidence,notes};
 },[axis,v1,trans,width,lead1,slur]);
 return <section className="workspace"><div className="panel controls"><div className="eyebrow"><Target size={16}/> Guided localizer</div><h2>Read the vector, then name a region</h2><p className="muted">Choose the observed PVC/VT morphology. The result is an anatomical estimate—not an ablation target.</p>
 <Field label="Inferior leads II & III" value={axis} set={setAxis} options={[['inferior','Positive / inferior axis'],['superior','Negative / superior axis']]}/>
 <Field label="V1 morphology" value={v1} set={setV1} options={[['lbbb','LBBB-type'],['rbbb','RBBB-type']]}/>
 <Field label="Precordial transition" value={trans} set={setTrans} options={[['v2early','V2 or earlier'],['v3','V3'],['v4plus','V4 or later']]}/>
 <Field label="QRS width" value={width} set={setWidth} options={[['narrow','<130 ms'],['broad','≥130 ms']]}/>
 <Field label="Lead I" value={lead1} set={setLead1} options={[['positive','Positive'],['negative','Negative']]}/>
 <label className="check"><input type="checkbox" checked={slur} onChange={e=>setSlur(e.target.checked)}/> Initial slur / delayed early activation</label></div>
 <div className="result"><span className="certainty">{result.confidence} confidence</span><div className="heartmap"><div className="pulse">VA</div><div className="orbit one"/><div className="orbit two"/></div><p className="kicker">Most likely region</p><h2>{result.label}</h2><div className="reason"><h3>Why this branch?</h3><ul><li>Axis: {axis}.</li><li>V1: {v1.toUpperCase()}-type; transition: {trans==='v2early'?'V2 or earlier':trans==='v3'?'V3':'V4 or later'}.</li>{result.notes.map((n,i)=><li key={i}>{n}</li>)}</ul></div><div className="caution"><ShieldAlert size={18}/><span>Confirm with full 12-lead quality, imaging, activation/pace mapping and local electrograms.</span></div></div></section>
}
function Field({label,value,set,options}){return <fieldset><legend>{label}</legend><div className="seg">{options.map(([v,t])=><button type="button" key={v} className={value===v?'on':''} onClick={()=>set(v)}>{t}</button>)}</div></fieldset>}

function CalculatorBox(){const[rp,setRp]=useState(4),[sp,setSp]=useState(6),[rs,setRs]=useState(8),[ss,setSs]=useState(2),[s2,setS2]=useState(8),[r3,setR3]=useState(7); const ratio=((+rp/(+rp + +sp))/(+rs/(+rs + +ss)||1));const idx=+s2/(+r3||1);return <div className="calc-grid"><div className="calc-card"><h3>V2 transition ratio</h3><p className="formula">(PVC R ÷ PVC R+S) ÷ (sinus R ÷ sinus R+S)</p><div className="inputs">{[['PVC R',rp,setRp],['PVC S',sp,setSp],['Sinus R',rs,setRs],['Sinus S',ss,setSs]].map(([l,v,s])=><label key={l}>{l}<input type="number" min="0" value={v} onChange={e=>s(e.target.value)}/></label>)}</div><Output value={ratio.toFixed(2)} left={ratio>=.6}/><p className="fine">≈0.60 or higher favors LVOT in V3-transition cases. Validate lead placement and recording gain.</p></div><div className="calc-card"><h3>V2S / V3R index</h3><p className="formula">S amplitude in V2 ÷ R amplitude in V3</p><div className="inputs two">{[['V2 S',s2,setS2],['V3 R',r3,setR3]].map(([l,v,s])=><label key={l}>{l}<input type="number" min="0" value={v} onChange={e=>s(e.target.value)}/></label>)}</div><Output value={idx.toFixed(2)} left={idx<=1.5}/><p className="fine">≈1.5 or lower supports LVOT; thresholds vary by cohort and recording conditions.</p></div></div>}
function Output({value,left}){return <div className="output"><b>{value}</b><span>{left?'LVOT favored':'RVOT favored'}</span></div>}

function App(){const[tab,setTab]=useState('localize'),[ci,setCi]=useState(0),[show,setShow]=useState(false);const c=cases[ci];return <><header><a className="brand" href="#"><span><Activity/></span><b>VA Origin Lab</b></a><nav>{[['localize','Localize'],['atlas','Atlas'],['cases','Cases'],['tools','Indices'],['evidence','Evidence']].map(([v,t])=><button className={tab===v?'active':''} onClick={()=>{setTab(v);setShow(false)}} key={v}>{t}</button>)}</nav><div className="badge">For clinician education</div></header><main>
{tab==='localize'&&<><div className="intro"><div><p className="eyebrow"><HeartPulse size={16}/> 12-lead ECG · anatomical reasoning</p><h1>Estimate where an idiopathic ventricular arrhythmia begins.</h1></div><p>Build a probable region from axis, V1 morphology, transition and QRS width—then test it against neighboring anatomy.</p></div><Localizer/></>}
{tab==='atlas'&&<section><Title icon={<BookOpen/>} title="Morphology atlas" sub="Use patterns as converging clues, never as isolated rules."/><div className="atlas">{sites.map(([a,b,c])=><article key={a}><span>{b}</span><h3>{a}</h3><p>{c}</p></article>)}</div></section>}
{tab==='cases'&&<section><Title icon={<Target/>} title="Worked cases" sub="Commit to a region before revealing the reasoning."/><div className="case-layout"><aside>{cases.map((x,i)=><button key={x.title} className={ci===i?'selected':''} onClick={()=>{setCi(i);setShow(false)}}><span>0{i+1}</span>{x.title}<ChevronRight/></button>)}</aside><article className="case"><p className="kicker">Case {ci+1} of {cases.length}</p><h2>{c.title}</h2><div className="stem">{c.stem}</div>{!show?<button className="primary" onClick={()=>setShow(true)}>Reveal localization</button>:<div className="reveal"><div className="answer"><span>Best estimate</span><h3>{c.answer}</h3>{c.corrected&&<em>Teaching correction: numerical data override the proposed label.</em>}</div><ol>{c.why.map(x=><li key={x}>{x}</li>)}</ol><div className="alternative"><Info size={18}/><p><b>Important alternative</b><br/>{c.alt}</p></div><button className="ghost" onClick={()=>setShow(false)}><RotateCcw size={16}/> Try again</button></div>}</article></div></section>}
{tab==='tools'&&<section><Title icon={<Calculator/>} title="Outflow-tract indices" sub="Adjuncts for the difficult V3-transition ECG—not stand-alone diagnoses."/><CalculatorBox/><div className="note"><Info/><div><b>Measurement discipline</b><p>Use the same ECG gain and lead placement for PVC and sinus beats. Measure absolute R and S amplitudes from the isoelectric line. Do not apply an index when components cannot be measured reliably.</p></div></div></section>}
{tab==='evidence'&&<section><Title icon={<BookOpen/>} title="Evidence library" sub="Open-access reviews, guidelines, and original index-validation studies."/><div className="refs">{refs.map(([a,u,m],i)=><a href={u} target="_blank" rel="noreferrer" key={u}><span>0{i+1}</span><div><h3>{a}</h3><p>{m}</p></div><ExternalLink/></a>)}</div><div className="disclaimer"><ShieldAlert/><div><b>Educational scope</b><p>This tool does not diagnose a patient, exclude structural or inherited disease, or select an ablation site. Syncope, sustained VT, exercise-induced or multifocal PVCs, reduced LV function, abnormal imaging, or a family history of cardiomyopathy/sudden death require formal specialist evaluation. Cardiac MRI may be needed even when routine ECG and echocardiography are unrevealing.</p></div></div></section>}
</main><footer><span>VA Origin Lab</span><p>Surface ECG predicts a neighborhood. Mapping establishes the site.</p></footer></>}
function Title({icon,title,sub}){return <div className="title"><span>{icon}</span><div><h1>{title}</h1><p>{sub}</p></div></div>}
createRoot(document.getElementById('root')).render(<App/>);

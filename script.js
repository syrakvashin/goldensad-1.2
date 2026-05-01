const STOCK_API_URL='https://script.google.com/macros/s/AKfycbw6CiFU3gHuwHPby3zXv9hCcGIF0HxWDLOroNsRt7apvHM5BvPzrfOD1MA1VAyP0o-z/exec';
const AIRMQ_URL='https://api.airmq.cc/';
const AIRMQ_LOCATION_ID='BY042010279';
const TREATMENTS_API_URL='https://script.google.com/macros/s/AKfycbziEuAPz4Kvg9GsvdSyKytYVEHSe2gcoSEmwKhp0unOVNm5OPdUYJf33mqn2qgDEZVd/exec';
const LS_MEASUREMENTS='sprayer_measurements_v1';
const LS_BLOCKS='sprayer_blocks_v2';
const LS_WEATHER='sprayer_weather_location_v1';
const LS_HERBICIDE='sprayer_herbicide_settings_v2';
const LS_CALC_SETTINGS='sprayer_calc_settings_v1';
const defaultMeasurements=[{pressure:3,flow:0.635},{pressure:4,flow:0.75},{pressure:5,flow:0.86},{pressure:6,flow:1.0},{pressure:7,flow:1.074},{pressure:8,flow:1.152},{pressure:9,flow:1.25},{pressure:10,flow:1.313},{pressure:11,flow:1.359},{pressure:12,flow:1.463},{pressure:15,flow:1.641}];
const defaultHerbicideSettings={spacing:4,flow:0.91,nozzles:4,stripWidth:1.10,speed:5,targetMin:250,targetMax:300,tank:800,blockId:''};
const defaultCalcSettings={norm:400,speed:8,nozzles:14,tank:3000};
const defaultBlocks=[{id:id(),name:'Яблоня около навеса 0',culture:'Яблоня',year:2023,rows:73,scheme:'4 × 1 м',count:17380,area:7.5},{id:id(),name:'Слива около базы 1',culture:'Слива',year:2023,rows:102,scheme:'4,5 × 3 м',count:16040,area:23.4},{id:id(),name:'Яблоня около деревни 2',culture:'Яблоня',year:2023,rows:85,scheme:'4 × 1 м',count:11880,area:5.1},{id:id(),name:'Яблоня между сливой и берез 3',culture:'Яблоня',year:2023,rows:25,scheme:'4 × 1 м',count:10040,area:5.2},{id:id(),name:'Слива за березами 4',culture:'Слива',year:2024,rows:58,scheme:'4,5 × 3 м',count:11600,area:19.1},{id:id(),name:'Яблоня за дорогой 2023 5',culture:'Яблоня',year:2023,rows:49,scheme:'4 × 1 м',count:16050,area:7.9},{id:id(),name:'Яблоня за дорогой 2025 5',culture:'Яблоня',year:2025,rows:0,scheme:'4 × 1 м',count:26500,area:10.0}];
let appState={mode:'from-block',activeTab:'calc',measurements:load(LS_MEASUREMENTS,defaultMeasurements),blocks:load(LS_BLOCKS,defaultBlocks),editingBlockId:null,stockRaw:[],stockFiltered:[],treatmentsRaw:[],treatmentGroups:[],treatmentsFilteredGroups:[],herbicideSettings:load(LS_HERBICIDE,defaultHerbicideSettings),calcSettings:load(LS_CALC_SETTINGS,defaultCalcSettings)};
const els={};
document.addEventListener('DOMContentLoaded',()=>{bindElements();bindEvents();initFromSavedWeather();initCalcInputs();renderTabs();renderMeasurements();renderBlocks();renderBlockSelect();initHerbicideInputs();toggleCalcModeFields();if(appState.blocks.length)updateCalcInputsFromBlock();calculate();calculateHerbicide();loadWeather();loadStock();loadAirMQ();loadTreatments();});
function bindElements(){['menuButton','closeMenuButton','sidePanel','overlay','blockSelect','cultureInput','areaInput','normInput','speedInput','spacingInput','nozzlesInput','tankInput','resetCalcSettingsBtn','resultCulture','resultArea','resultLiters','resultTanks','resultTotalFlow','resultFlowPerNozzle','resultPressure','pressureStatus','pressureLower','pressureUpper','blockSelectWrap','cultureField','areaField','spacingField','measurementNozzleName','measurementNozzleCode','measurementType','measurementPressure','measurementFlow','measurementsBody','saveMeasurementBtn','blockName','blockCulture','blockYear','blockRows','blockScheme','blockCount','blockArea','saveBlockBtn','blocksBody','blockEditNotice','weatherCity','weatherLat','weatherLon','weatherLoadBtn','weatherPlace','weatherStatus','weatherCards','stockBody','stockStatus','stockTypeFilter','stockSortBy','airReloadBtn','airInfo','airStatus','airTemp','airHum','airPms1','airPms25','airPms10','airTime','treatmentsStatus','treatmentPlaceFilter','treatmentWorkerFilter','treatmentChemFilter','treatmentTypeFilter','treatmentsDays','herbicideBlockSelect','herbicideFlow','herbicideNozzles','herbicideStripWidth','herbicideSpeed','herbicideTargetMin','herbicideTargetMax','herbicideTank','saveHerbicideSettingsBtn','resetHerbicideSettingsBtn','herbicideStatus','herbicideNormStrip','herbicideAdvice','herbicideSpeedRange','herbicideTotalFlow','herbicideBlockAreaResult','herbicideGardenNorm','herbicideTreatedArea','herbicideTotalLiters','herbicideTanks'].forEach(id=>els[id]=document.getElementById(id));}
function bindEvents(){document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{appState.activeTab=btn.dataset.tab;closePanels();renderTabs();}));document.querySelectorAll('.subtab-btn').forEach(btn=>btn.addEventListener('click',()=>{appState.mode=btn.dataset.mode;document.querySelectorAll('.subtab-btn').forEach(x=>x.classList.toggle('active',x===btn));toggleCalcModeFields();if(appState.mode==='from-block')updateCalcInputsFromBlock();calculate();}));['normInput','speedInput','spacingInput','nozzlesInput','tankInput','cultureInput','areaInput'].forEach(id=>els[id].addEventListener('input',()=>{saveCalcSettings();calculate();}));els.blockSelect.addEventListener('change',()=>{updateCalcInputsFromBlock();calculate();});els.menuButton.addEventListener('click',openMenu);els.closeMenuButton.addEventListener('click',closeMenu);els.overlay.addEventListener('click',closeMenu);document.querySelectorAll('.side-link').forEach(btn=>btn.addEventListener('click',()=>{openPanel(btn.dataset.panel);closeMenu();}));els.saveMeasurementBtn.addEventListener('click',saveMeasurement);els.saveBlockBtn.addEventListener('click',saveBlock);els.weatherLoadBtn.addEventListener('click',loadWeather);els.stockTypeFilter.addEventListener('change',applyStockFilters);els.stockSortBy.addEventListener('change',applyStockFilters);els.airReloadBtn.addEventListener('click',loadAirMQ);els.treatmentPlaceFilter.addEventListener('change',applyTreatmentsFilters);els.treatmentWorkerFilter.addEventListener('change',applyTreatmentsFilters);els.treatmentChemFilter.addEventListener('change',applyTreatmentsFilters);els.treatmentTypeFilter.addEventListener('change',applyTreatmentsFilters);['herbicideFlow','herbicideNozzles','herbicideStripWidth','herbicideSpeed','herbicideTargetMin','herbicideTargetMax','herbicideTank'].forEach(id=>els[id]&&els[id].addEventListener('input',calculateHerbicide));if(els.herbicideBlockSelect)els.herbicideBlockSelect.addEventListener('change',()=>{updateHerbicideInputsFromBlock();calculateHerbicide();});if(els.saveHerbicideSettingsBtn)els.saveHerbicideSettingsBtn.addEventListener('click',saveHerbicideSettings);if(els.resetCalcSettingsBtn)els.resetCalcSettingsBtn.addEventListener('click',resetCalcSettings);if(els.resetHerbicideSettingsBtn)els.resetHerbicideSettingsBtn.addEventListener('click',resetHerbicideSettings);}
function initCalcInputs(){
  const s={...defaultCalcSettings,...appState.calcSettings};
  if(els.normInput)els.normInput.value=s.norm;
  if(els.speedInput)els.speedInput.value=s.speed;
  if(els.nozzlesInput)els.nozzlesInput.value=s.nozzles;
  if(els.tankInput)els.tankInput.value=s.tank;
}
function saveCalcSettings(){
  appState.calcSettings={norm:toNum(els.normInput?.value),speed:toNum(els.speedInput?.value),nozzles:toNum(els.nozzlesInput?.value),tank:toNum(els.tankInput?.value)};
  save(LS_CALC_SETTINGS,appState.calcSettings);
}
function resetCalcSettings(){
  appState.calcSettings={...defaultCalcSettings};
  save(LS_CALC_SETTINGS,appState.calcSettings);
  initCalcInputs();
  calculate();
}

function renderTabs(){document.querySelectorAll('.tab-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===appState.activeTab));document.querySelectorAll('.tab-content').forEach(sec=>sec.classList.remove('active'));const target=document.getElementById(`tab-${appState.activeTab}`);if(target)target.classList.add('active');}
function openPanel(name){closeTabs();document.querySelectorAll('.panel-content').forEach(sec=>sec.classList.remove('active'));const el=document.getElementById(`panel-${name}`);if(el)el.classList.add('active');}
function closePanels(){document.querySelectorAll('.panel-content').forEach(sec=>sec.classList.remove('active'));}
function closeTabs(){document.querySelectorAll('.tab-content').forEach(sec=>sec.classList.remove('active'));document.querySelectorAll('.tab-btn').forEach(btn=>btn.classList.remove('active'));}
function openMenu(){els.sidePanel.classList.add('open');els.overlay.classList.add('show');}
function closeMenu(){els.sidePanel.classList.remove('open');els.overlay.classList.remove('show');}
function renderBlockSelect(){els.blockSelect.innerHTML='';if(els.herbicideBlockSelect)els.herbicideBlockSelect.innerHTML='';appState.blocks.forEach(block=>{const opt=document.createElement('option');opt.value=block.id;opt.textContent=block.name;els.blockSelect.appendChild(opt);if(els.herbicideBlockSelect){const opt2=document.createElement('option');opt2.value=block.id;opt2.textContent=block.name;els.herbicideBlockSelect.appendChild(opt2);}});if(els.herbicideBlockSelect&&appState.herbicideSettings.blockId){els.herbicideBlockSelect.value=appState.herbicideSettings.blockId;}}
function toggleCalcModeFields(){const fromBlock=appState.mode==='from-block';els.blockSelectWrap.style.display=fromBlock?'':'none';['cultureField','areaField','spacingField'].forEach(id=>{if(els[id])els[id].classList.toggle('hidden-field',fromBlock);});}
function getSelectedBlock(){return appState.blocks.find(b=>String(b.id)===String(els.blockSelect.value))||appState.blocks[0];}
function updateCalcInputsFromBlock(){const block=getSelectedBlock();if(!block)return;els.cultureInput.value=block.culture||'';els.areaInput.value=num(block.area);els.spacingInput.value=parseSpacing(block.scheme);}
function calculate(){const culture=els.cultureInput.value||'—',area=toNum(els.areaInput.value),norm=toNum(els.normInput.value),speed=toNum(els.speedInput.value),spacing=toNum(els.spacingInput.value),nozzles=toNum(els.nozzlesInput.value),tank=toNum(els.tankInput.value);const totalLiters=area*norm,totalFlow=speed>0&&spacing>0?(norm*speed*spacing)/600:0,flowPerNozzle=nozzles>0?totalFlow/nozzles:0,pressure=interpolatePressure(flowPerNozzle,appState.measurements);els.resultCulture.textContent=culture;els.resultArea.textContent=isFinite(area)?`${fmt(area,2)} га`:'—';els.resultLiters.textContent=isFinite(totalLiters)?`${fmt(totalLiters,0)} л`:'—';els.resultTanks.textContent=tank>0?fmt(totalLiters/tank,2):'—';els.resultTotalFlow.textContent=isFinite(totalFlow)?`${fmt(totalFlow,3)} л/мин`:'—';els.resultFlowPerNozzle.textContent=isFinite(flowPerNozzle)?`${fmt(flowPerNozzle,3)} л/мин`:'—';els.resultPressure.textContent=pressure.pressure!=null?`${fmt(pressure.pressure,2)} бар`:'—';els.pressureStatus.textContent=pressure.status;els.pressureLower.textContent=pressure.lower?`Нижняя точка: ${fmt(pressure.lower.flow,3)} л/мин при ${fmt(pressure.lower.pressure,0)} бар`:'';els.pressureUpper.textContent=pressure.upper?`Верхняя точка: ${fmt(pressure.upper.flow,3)} л/мин при ${fmt(pressure.upper.pressure,0)} бар`:'';}
function sortMeasurements(list){return [...list].map(x=>({pressure:toNum(x.pressure),flow:toNum(x.flow)})).filter(x=>x.pressure>0&&x.flow>0).sort((a,b)=>a.flow-b.flow);}
function interpolatePressure(targetFlow,list){const rows=sortMeasurements(list);if(!rows.length||!isFinite(targetFlow)||targetFlow<=0)return{status:'Нет данных',pressure:null};if(rows.length===1)return{status:'Мало точек',pressure:rows[0].pressure,lower:rows[0],upper:rows[0]};if(targetFlow<rows[0].flow)return{status:'Ниже таблицы',pressure:null,lower:rows[0],upper:rows[1]};if(targetFlow>rows[rows.length-1].flow)return{status:'Выше таблицы',pressure:null,lower:rows[rows.length-2],upper:rows[rows.length-1]};for(let i=0;i<rows.length-1;i++){const lower=rows[i],upper=rows[i+1];if(targetFlow===lower.flow)return{status:'Точное совпадение',pressure:lower.pressure,lower,upper:lower};if(targetFlow>=lower.flow&&targetFlow<=upper.flow){const ratio=(targetFlow-lower.flow)/(upper.flow-lower.flow);return{status:'В пределах таблицы',pressure:lower.pressure+ratio*(upper.pressure-lower.pressure),lower,upper};}}return{status:'Ошибка расчёта',pressure:null};}
function saveMeasurement(){const pressure=toNum(els.measurementPressure.value),flow=toNum(els.measurementFlow.value);const nozzleName=(els.measurementNozzleName?.value||'').trim();const nozzleCode=(els.measurementNozzleCode?.value||'').trim();const type=(els.measurementType?.value||'fan').trim();if(!(pressure>0&&flow>0))return;appState.measurements.push({pressure,flow,nozzleName,nozzleCode,type});save(LS_MEASUREMENTS,appState.measurements);if(els.measurementNozzleName)els.measurementNozzleName.value='';if(els.measurementNozzleCode)els.measurementNozzleCode.value='';els.measurementPressure.value='';els.measurementFlow.value='';renderMeasurements();calculate();}
function renderMeasurements(){const rows=[...appState.measurements].map((x,idx)=>({idx,pressure:toNum(x.pressure),flow:toNum(x.flow),nozzleName:String(x.nozzleName||''),nozzleCode:String(x.nozzleCode||''),type:String(x.type||'fan')})).filter(x=>x.pressure>0&&x.flow>0).sort((a,b)=>a.flow-b.flow);els.measurementsBody.innerHTML='';rows.forEach(row=>{const tr=document.createElement('tr');const nozzle=[row.nozzleName,row.nozzleCode].filter(Boolean).join(' / ')||'—';const typeLabel=row.type==='herbicide'?'Гербицидная':'Вентиляторная';tr.innerHTML=`<td>${escapeHtml(nozzle)}</td><td>${typeLabel}</td><td>${fmt(row.pressure,3)}</td><td>${fmt(row.flow,3)}</td><td><button class="action-btn" data-remove="${row.idx}">Удалить</button></td>`;els.measurementsBody.appendChild(tr);});els.measurementsBody.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{const idx=Number(btn.dataset.remove);appState.measurements=appState.measurements.filter((_,i)=>i!==idx);save(LS_MEASUREMENTS,appState.measurements);renderMeasurements();calculate();}));}
function saveBlock(){const block={id:appState.editingBlockId||id(),name:els.blockName.value.trim(),culture:els.blockCulture.value.trim(),year:toNum(els.blockYear.value),rows:toNum(els.blockRows.value),scheme:els.blockScheme.value.trim(),count:toNum(els.blockCount.value),area:toNum(els.blockArea.value)};if(!block.name)return;if(appState.editingBlockId){appState.blocks=appState.blocks.map(b=>b.id===appState.editingBlockId?block:b);}else{appState.blocks.push(block);}appState.editingBlockId=null;els.blockEditNotice.textContent='';clearBlockForm();save(LS_BLOCKS,appState.blocks);renderBlocks();renderBlockSelect();calculate();}
function renderBlocks(){els.blocksBody.innerHTML='';appState.blocks.forEach(block=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${escapeHtml(block.name)}</td><td>${escapeHtml(block.culture||'')}</td><td>${fmt(block.year,0)}</td><td>${fmt(block.rows,0)}</td><td>${escapeHtml(block.scheme||'')}</td><td>${fmt(block.count,0)}</td><td>${fmt(block.area,2)}</td><td><button class="action-btn" data-edit="${block.id}">Изменить</button><button class="action-btn" data-delete="${block.id}">Удалить</button></td>`;els.blocksBody.appendChild(tr);});els.blocksBody.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>editBlock(btn.dataset.edit)));els.blocksBody.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>deleteBlock(btn.dataset.delete)));}
function editBlock(blockId){const block=appState.blocks.find(b=>String(b.id)===String(blockId));if(!block)return;appState.editingBlockId=block.id;els.blockName.value=block.name||'';els.blockCulture.value=block.culture||'';els.blockYear.value=block.year||'';els.blockRows.value=block.rows||'';els.blockScheme.value=block.scheme||'';els.blockCount.value=block.count||'';els.blockArea.value=block.area||'';els.blockEditNotice.textContent=`Редактируется: ${block.name}`;openPanel('blocks');}
function deleteBlock(blockId){appState.blocks=appState.blocks.filter(b=>String(b.id)!==String(blockId));save(LS_BLOCKS,appState.blocks);renderBlocks();renderBlockSelect();calculate();}
function clearBlockForm(){['blockName','blockCulture','blockYear','blockRows','blockScheme','blockCount','blockArea'].forEach(id=>els[id].value='');}

function initHerbicideInputs(){
  const s={...defaultHerbicideSettings,...appState.herbicideSettings};
  ['flow','nozzles','stripWidth','speed','targetMin','targetMax','tank'].forEach(key=>{
    const el=els['herbicide'+key.charAt(0).toUpperCase()+key.slice(1)];
    if(el)el.value=s[key];
  });
  if(els.herbicideBlockSelect&&s.blockId)els.herbicideBlockSelect.value=s.blockId;
  if(!s.blockId&&appState.blocks.length){updateHerbicideInputsFromBlock(false);}
}




function getHerbicideBlock(){
  return appState.blocks.find(b=>String(b.id)===String(els.herbicideBlockSelect?.value))||null;
}
function updateHerbicideInputsFromBlock(saveNow=true){
  const block=getHerbicideBlock();
  if(!block)return;
  if(saveNow)saveHerbicideSettings(false);
}
function getHerbicideSpacing(){
  const block=getHerbicideBlock();
  const fromBlock=block?parseSpacing(block.scheme):0;
  const saved=toNum(appState.herbicideSettings?.spacing);
  return fromBlock||saved||defaultHerbicideSettings.spacing;
}
function readHerbicideSettings(){
  return{
    blockId:els.herbicideBlockSelect?.value||'',
    spacing:getHerbicideSpacing(),
    flow:toNum(els.herbicideFlow.value),
    nozzles:toNum(els.herbicideNozzles.value),
    stripWidth:toNum(els.herbicideStripWidth.value),
    speed:toNum(els.herbicideSpeed.value),
    targetMin:toNum(els.herbicideTargetMin.value),
    targetMax:toNum(els.herbicideTargetMax.value),
    tank:toNum(els.herbicideTank.value)
  };
}
function saveHerbicideSettings(showNotice=true){
  appState.herbicideSettings=readHerbicideSettings();
  save(LS_HERBICIDE,appState.herbicideSettings);
  if(showNotice&&els.herbicideAdvice){
    els.herbicideAdvice.textContent='Настройки сохранены.';
    setTimeout(()=>calculateHerbicide(),900);
  }
}
function resetHerbicideSettings(){
  appState.herbicideSettings={...defaultHerbicideSettings,blockId:els.herbicideBlockSelect?.value||''};
  save(LS_HERBICIDE,appState.herbicideSettings);
  initHerbicideInputs();
  calculateHerbicide();
}
function calculateHerbicide(){
  if(!els.herbicideFlow)return;
  const s=readHerbicideSettings();
  appState.herbicideSettings=s;
  save(LS_HERBICIDE,s);
  const totalFlow=s.flow*s.nozzles;
  const targetMin=Math.min(s.targetMin,s.targetMax),targetMax=Math.max(s.targetMin,s.targetMax);
  const normStrip=s.speed>0&&s.stripWidth>0?600*totalFlow/s.speed/s.stripWidth:0;
  const speedForMin=targetMin>0&&s.stripWidth>0?600*totalFlow/targetMin/s.stripWidth:0;
  const speedForMax=targetMax>0&&s.stripWidth>0?600*totalFlow/targetMax/s.stripWidth:0;
  const block=getHerbicideBlock();
  const blockArea=block?toNum(block.area):0;
  const gardenNorm=s.spacing>0?normStrip*s.stripWidth/s.spacing:0;
  const treatedArea=s.spacing>0&&blockArea>0?blockArea*s.stripWidth/s.spacing:0;
  const totalLiters=gardenNorm*blockArea;
  const tanks=s.tank>0?totalLiters/s.tank:0;
  if(els.herbicideBlockAreaResult)els.herbicideBlockAreaResult.textContent=blockArea>0?`${fmt(blockArea,2)} га`:'—';
  els.herbicideNormStrip.textContent=normStrip>0?`${fmt(normStrip,0)} л/га полосы`:'—';
  els.herbicideTotalFlow.textContent=totalFlow>0?`${fmt(totalFlow,2)} л/мин`:'—';
  els.herbicideSpeedRange.textContent=speedForMin>0&&speedForMax>0?`${fmt(speedForMax,1)}–${fmt(speedForMin,1)} км/ч`:'—';
  els.herbicideGardenNorm.textContent=gardenNorm>0?`${fmt(gardenNorm,1)} л/га сада`:'—';
  els.herbicideTreatedArea.textContent=treatedArea>0?`${fmt(treatedArea,2)} га`:'—';
  els.herbicideTotalLiters.textContent=totalLiters>0?`${fmt(totalLiters,0)} л`:'—';
  els.herbicideTanks.textContent=tanks>0?fmt(tanks,2):'—';
  if(normStrip>=targetMin&&normStrip<=targetMax){
    els.herbicideStatus.textContent='Норма попала';
    els.herbicideAdvice.textContent=`При ${fmt(s.speed,1)} км/ч вы попадаете в диапазон ${fmt(targetMin,0)}–${fmt(targetMax,0)} л/га полосы. Площадь участка берётся из выбранного участка.`;
  }else if(normStrip>targetMax){
    els.herbicideStatus.textContent='Много воды';
    els.herbicideAdvice.textContent=`Чтобы попасть в норму, увеличьте скорость примерно до ${fmt(speedForMax,1)}–${fmt(speedForMin,1)} км/ч или уменьшите давление/вылив.`;
  }else if(normStrip>0){
    els.herbicideStatus.textContent='Мало воды';
    els.herbicideAdvice.textContent=`Чтобы попасть в норму, снизьте скорость примерно до ${fmt(speedForMax,1)}–${fmt(speedForMin,1)} км/ч или поставьте форсунки крупнее/добавьте распылитель.`;
  }else{
    els.herbicideStatus.textContent='Нет данных';
    els.herbicideAdvice.textContent='Проверьте вылив, скорость и ширину полосы.';
  }
}

async function loadWeather(){const city=(els.weatherCity.value||'').trim();let lat=toNum(els.weatherLat.value),lon=toNum(els.weatherLon.value);els.weatherStatus.textContent='Загрузка погоды...';els.weatherCards.innerHTML='';try{if(city){const geoUrl=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;const geoResp=await fetch(geoUrl);const geoData=await geoResp.json();if(!geoData.results||!geoData.results.length)throw new Error('Город не найден');lat=geoData.results[0].latitude;lon=geoData.results[0].longitude;els.weatherLat.value=lat;els.weatherLon.value=lon;els.weatherPlace.textContent=`${geoData.results[0].name}${geoData.results[0].country?', '+geoData.results[0].country:''}`;}else{els.weatherPlace.textContent=`Координаты: ${fmt(lat,6)}, ${fmt(lon,6)}`;}save(LS_WEATHER,{city,lat,lon});const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,precipitation_probability_max&timezone=auto`;const resp=await fetch(url);const data=await resp.json();renderWeather(data);els.weatherStatus.textContent='';}catch(e){els.weatherStatus.textContent=`Ошибка погоды: ${e.message}`;}}
function renderWeather(data){const d=data.daily;els.weatherCards.innerHTML='';if(!d||!d.time){els.weatherStatus.textContent='Нет данных погоды';return;}d.time.forEach((date,i)=>{const card=document.createElement('div');card.className='weather-card';card.innerHTML=`<div class="day">${formatDateRu(date)}</div><div>Темп.: <strong>${fmt(d.temperature_2m_max[i],1)} / ${fmt(d.temperature_2m_min[i],1)} °C</strong></div><div>Осадки: <strong>${fmt(d.precipitation_sum[i],1)} мм</strong></div><div>Вероятность дождя: <strong>${fmt(d.precipitation_probability_max[i],0)}%</strong></div><div>Ветер: <strong>${fmt(d.windspeed_10m_max[i],1)} км/ч</strong></div>`;els.weatherCards.appendChild(card);});}
function initFromSavedWeather(){const saved=load(LS_WEATHER,{city:'',lat:53.414120,lon:24.678197});els.weatherCity.value=saved.city||'';els.weatherLat.value=saved.lat??53.414120;els.weatherLon.value=saved.lon??24.678197;}
async function loadAirMQ(){els.airStatus.textContent='Загрузка AirMQ...';try{const now=new Date(),from=new Date(now.getTime()-24*60*60*1000);const payload={operationName:'LocationTimeseries',query:'query LocationTimeseries($id: String!, $tFrom: String!, $tTo: String!, $intervalM: Int!) { location(filter: {_id: $id}) { _id city name isOnline latitude longitude timeSeries(filter: {t_from: $tFrom, t_to: $tTo, interval_m: $intervalM}) { time Temp Hum Press PMS1 PMS10 PMS25 Count NOx VOC __typename } metricList status { uptime __typename } currentValue { time Temp Hum Press PMS1 PMS10 PMS25 Count NOx VOC __typename } __typename } }',variables:{id:AIRMQ_LOCATION_ID,tFrom:from.toISOString(),tTo:now.toISOString(),intervalM:10}};const resp=await fetch(AIRMQ_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await resp.json(),location=data?.data?.location,current=location?.currentValue;if(!location||!current)throw new Error('Нет данных датчика');els.airInfo.textContent=`${location.name || 'Датчик'} · ${location.city || ''}`;els.airTemp.textContent=`${fmt(current.Temp,2)} °C`;els.airHum.textContent=`${fmt(current.Hum,2)} %`;els.airPms1.textContent=fmt(current.PMS1,2);els.airPms25.textContent=fmt(current.PMS25,2);els.airPms10.textContent=fmt(current.PMS10,2);els.airTime.textContent=formatDateTimeRu(current.time);els.airStatus.textContent=location.isOnline ? 'Датчик онлайн' : 'Датчик офлайн, показаны последние данные';}catch(e){els.airStatus.textContent=`Ошибка AirMQ: ${e.message}`;}}
async function loadStock(){els.stockStatus.textContent='Загрузка склада...';els.stockBody.innerHTML='';try{const resp=await fetch(STOCK_API_URL),raw=await resp.json(),rows=Array.isArray(raw)?raw:(raw.data||[]);appState.stockRaw=rows.map(normalizeStockItem).filter(x=>x.name);renderStockTypeOptions();applyStockFilters();}catch(e){els.stockStatus.textContent=`Ошибка загрузки склада: ${e.message}`;}}
function normalizeStockItem(item){const keys=Object.keys(item||{}),get=(...variants)=>{for(const v of variants){if(item[v]!==undefined)return item[v];const found=keys.find(k=>normalizeKey(k)===normalizeKey(v));if(found)return item[found];}return '';};return{name:String(get('Название','name')).trim(),type:String(get('Вид химии','Вид_химии','type')).trim(),unit:String(get('Ед_изм','Ед изм','Ед.изм.','unit')).trim(),bought:toNum(get('Куплено','bought')),used:toNum(get('Израсходовано','used')),has:toNum(get('Есть','Остаток','has'))};}
function normalizeKey(value){return String(value).toLowerCase().replaceAll('_','').replaceAll(' ','').replaceAll('.','');}
function renderStockTypeOptions(){const types=[...new Set(appState.stockRaw.map(x=>x.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));fillSelect(els.stockTypeFilter,'Все виды',types);}
function applyStockFilters(){const typeFilter=els.stockTypeFilter.value||'all',sortBy=els.stockSortBy.value||'name';let rows=appState.stockRaw.filter(x=>x.has>0||x.bought>0||x.used>0);if(typeFilter!=='all')rows=rows.filter(x=>x.type===typeFilter);rows.sort((a,b)=>{if(sortBy==='type')return cmp(a.type,b.type)||cmp(a.name,b.name);if(sortBy==='has_desc')return b.has-a.has||cmp(a.name,b.name);if(sortBy==='has_asc')return a.has-b.has||cmp(a.name,b.name);if(sortBy==='used_desc')return b.used-a.used||cmp(a.name,b.name);return cmp(a.name,b.name);});appState.stockFiltered=rows;renderStock();els.stockStatus.textContent=`Позиций: ${rows.length}`;}
function renderStock(){els.stockBody.innerHTML='';if(!appState.stockFiltered.length){const tr=document.createElement('tr');tr.innerHTML='<td colspan="6" class="muted">Нет позиций по выбранному фильтру.</td>';els.stockBody.appendChild(tr);return;}appState.stockFiltered.forEach(item=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.type||'—')}</td><td>${escapeHtml(item.unit||'—')}</td><td>${fmt(item.bought,2)}</td><td>${fmt(item.used,2)}</td><td><strong>${fmt(item.has,2)}</strong></td>`;els.stockBody.appendChild(tr);});}
async function loadTreatments(){els.treatmentsStatus.textContent='Загрузка обработок...';try{const resp=await fetch(TREATMENTS_API_URL);const raw=await resp.json();const rows=Array.isArray(raw)?raw:(Array.isArray(raw.data)?raw.data:[]);if(rows.length&&Array.isArray(rows[0].chemicals)){appState.treatmentGroups=normalizeTreatmentGroups(rows);appState.treatmentsRaw=[];}else{appState.treatmentsRaw=normalizeTreatmentRows(rows);appState.treatmentGroups=groupTreatments(appState.treatmentsRaw);}renderTreatmentsFilters();applyTreatmentsFilters();}catch(e){els.treatmentsStatus.textContent=`Ошибка загрузки обработок: ${e.message}`;appState.treatmentsRaw=[];appState.treatmentGroups=[];renderTreatmentsFilters();applyTreatmentsFilters();}}
function normalizeTreatmentGroups(groups){return groups.map(group=>{const places=Array.isArray(group.places)?group.places.map(x=>String(x||'').trim()).filter(Boolean):String(group.place||'').split('|').map(x=>String(x||'').trim()).filter(Boolean);return({treatmentNumber:group.treatmentNumber||group.rowNum||'',date:String(group.date||''),worker:String(group.worker||''),place:String(group.place||places.join(' | ')||''),places:places,method:String(group.method||''),tankLiters:normalizeAmount(group.tankLiters),tankUnit:String(group.tankUnit||''),notes:Array.isArray(group.notes)?group.notes.filter(Boolean).map(String):[],chemicals:Array.isArray(group.chemicals)?group.chemicals.map(c=>({chemType:String(c.chemType||''),chemical:String(c.chemical||''),amount:normalizeAmount(c.amount),amountUnit:String(c.amountUnit||'')})).filter(c=>c.chemical||c.chemType||c.amount!==''||c.amountUnit):[]});}).filter(group=>group.date||group.place||group.worker||group.chemicals.length);}
function normalizeTreatmentRows(rows){return (rows||[]).map(x=>({split:isSplitRow(x),treatmentNumber:x.treatmentNumber||x.rowNum||'',date:String(x.date||''),worker:String(x.worker||''),chemType:String(x.chemType||''),chemical:String(x.chemical||''),amount:normalizeAmount(x.amount),amountUnit:String(x.amountUnit||''),tankLiters:normalizeAmount(x.tankLiters),tankUnit:String(x.tankUnit||''),place:String(x.place||''),method:String(x.method||''),note:String(x.note||'')}));}
function isSplitRow(row){const markers=[row&&row.treatmentNumber,row&&row.rowNum,row&&row.marker,row&&row.split];return markers.some(v=>String(v||'').trim().toLowerCase()==='#split');}
function groupTreatments(rows){const groups=[];let current=null;const flush=()=>{if(!current)return;current.chemicals=current.chemicals.filter(c=>c.chemical||c.chemType||c.amount!==''||c.amountUnit);if(current.date||current.place||current.worker||current.method||current.tankLiters!==''||current.chemicals.length){groups.push(current);}current=null;};rows.forEach(row=>{if(row.split){flush();return;}const isEmpty=!row.date&&!row.worker&&!row.place&&!row.method&&row.tankLiters===''&&!row.tankUnit&&!row.chemical&&!row.chemType&&row.amount===''&&!row.amountUnit&&!row.note;if(isEmpty){flush();return;}if(!current){current={treatmentNumber:row.treatmentNumber||'',date:row.date||'',worker:row.worker||'',place:row.place||'',method:row.method||'',tankLiters:row.tankLiters,tankUnit:row.tankUnit||'',chemicals:[],notes:[]};}if(!current.treatmentNumber&&row.treatmentNumber)current.treatmentNumber=row.treatmentNumber;if(!current.date&&row.date)current.date=row.date;if(!current.worker&&row.worker)current.worker=row.worker;if(!current.place&&row.place)current.place=row.place;if(!current.method&&row.method)current.method=row.method;if(current.tankLiters===''&&row.tankLiters!=='')current.tankLiters=row.tankLiters;if(!current.tankUnit&&row.tankUnit)current.tankUnit=row.tankUnit;if(row.chemical||row.chemType||row.amount!==''||row.amountUnit){current.chemicals.push({chemType:row.chemType||'',chemical:row.chemical||'',amount:row.amount,amountUnit:row.amountUnit||''});}if(row.note)current.notes.push(row.note);});flush();return groups;}
function normalizeAmount(value){if(value===null||value===undefined||value==='')return '';const n=Number(String(value).replace(',', '.').trim());if(!Number.isFinite(n))return String(value).trim();return Math.round((n+Number.EPSILON)*1000)/1000;}
function formatAmount(value){if(value===null||value===undefined||value==='')return '';const n=Number(String(value).replace(',', '.').trim());if(!Number.isFinite(n))return String(value);return String(Math.round((n+Number.EPSILON)*1000)/1000).replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1');}
function renderTreatmentsFilters(){const places=[...new Set(appState.treatmentGroups.flatMap(x=>Array.isArray(x.places)&&x.places.length?x.places:[x.place]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));const workers=[...new Set(appState.treatmentGroups.map(x=>x.worker).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));const chems=[...new Set(appState.treatmentGroups.flatMap(x=>x.chemicals.map(c=>c.chemical)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));const types=[...new Set(appState.treatmentGroups.flatMap(x=>x.chemicals.map(c=>c.chemType)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));fillSelect(els.treatmentPlaceFilter,'Все участки',places);fillSelect(els.treatmentWorkerFilter,'Все трактористы',workers);fillSelect(els.treatmentChemFilter,'Вся химия',chems);fillSelect(els.treatmentTypeFilter,'Все виды',types);}
function fillSelect(select,firstLabel,items){if(!select)return;const prev=select.value||'all';select.innerHTML='';const first=document.createElement('option');first.value='all';first.textContent=firstLabel;select.appendChild(first);items.forEach(item=>{const opt=document.createElement('option');opt.value=item;opt.textContent=item;select.appendChild(opt);});if([...select.options].some(o=>o.value===prev))select.value=prev;}
function applyTreatmentsFilters(){const place=els.treatmentPlaceFilter.value||'all',worker=els.treatmentWorkerFilter.value||'all',chem=els.treatmentChemFilter.value||'all',type=els.treatmentTypeFilter.value||'all';let groups=[...appState.treatmentGroups];if(place!=='all')groups=groups.filter(x=>(Array.isArray(x.places)&&x.places.length?x.places:[x.place]).includes(place));if(worker!=='all')groups=groups.filter(x=>x.worker===worker);if(chem!=='all')groups=groups.filter(x=>x.chemicals.some(c=>c.chemical===chem));if(type!=='all')groups=groups.filter(x=>x.chemicals.some(c=>c.chemType===type));groups.sort((a,b)=>String(b.date).localeCompare(String(a.date)));appState.treatmentsFilteredGroups=groups;renderTreatmentsDays();els.treatmentsStatus.textContent=`Обработок: ${groups.length}`;}
function renderTreatmentsDays(){els.treatmentsDays.innerHTML='';if(!appState.treatmentsFilteredGroups.length){els.treatmentsDays.innerHTML='<div class="muted">Нет обработок по выбранному фильтру.</div>';return;}const byDate={};appState.treatmentsFilteredGroups.forEach(group=>{if(!byDate[group.date])byDate[group.date]=[];byDate[group.date].push(group);});Object.keys(byDate).sort((a,b)=>String(b).localeCompare(String(a))).forEach(date=>{const day=document.createElement('div');day.className='day-group';const title=document.createElement('div');title.className='day-title';title.textContent=date;day.appendChild(title);byDate[date].forEach(group=>{const card=document.createElement('div');card.className='treatment-card';const places=(Array.isArray(group.places)&&group.places.length?group.places:(group.place?[group.place]:[])).filter(Boolean);const placesText=places.join(' | ');const chems=group.chemicals.map(c=>{const left=[c.chemical,c.chemType?`(${c.chemType})`:'' ].filter(Boolean).join(' ');const right=[formatAmount(c.amount),c.amountUnit].filter(Boolean).join(' ');return `<li>${escapeHtml(left)}${right?' — '+escapeHtml(right):''}</li>`;}).join('');card.innerHTML=`<div class="treatment-top"><div class="treatment-title">${escapeHtml(placesText||'Место не указано')}</div><div class="muted">${escapeHtml(group.method||'Метод не указан')}</div></div><div class="meta-grid"><div><strong>Тракторист:</strong> ${escapeHtml(group.worker||'—')}</div><div><strong>Вода:</strong> ${escapeHtml(formatAmount(group.tankLiters)||'—')} ${escapeHtml(String(group.tankUnit||''))}</div></div><ul class="chem-list">${chems||'<li>Химия не указана</li>'}</ul>${group.notes&&group.notes.length?`<div class="muted"><strong>Примечание:</strong> ${escapeHtml(group.notes.join('; '))}</div>`:''}`;day.appendChild(card);});els.treatmentsDays.appendChild(day);});}
function cmp(a,b){return String(a||'').localeCompare(String(b||''),'ru');}
function parseSpacing(scheme){if(!scheme)return 4;const normalized=String(scheme).replace(',', '.');const match=normalized.match(/(\d+(?:\.\d+)?)/);return match?Number(match[1]):4;}
function toNum(value){if(value===null||value===undefined||value==='')return 0;return Number(String(value).replace(',', '.'));}
function fmt(value,digits=2){const num=toNum(value);if(!isFinite(num))return '—';return num.toFixed(digits);}
function num(value){const n=toNum(value);return isFinite(n)?n:'';}
function load(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value));}
function formatDateRu(dateStr){const d=new Date(dateStr);return d.toLocaleDateString('ru-RU',{weekday:'short',day:'2-digit',month:'2-digit'});}
function formatDateTimeRu(dateStr){const d=new Date(dateStr);return d.toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});}
function escapeHtml(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}
function id(){return Math.random().toString(36).slice(2,10);}

let deferredInstallPrompt = null;
const installAppBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppBtn) installAppBtn.hidden = false;
});

if (installAppBtn) {
  installAppBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installAppBtn.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  if (installAppBtn) installAppBtn.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

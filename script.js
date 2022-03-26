const positionButtons=document.getElementById("position-buttons");
const countryPage=document.getElementById("news-page");
const countryFlag=document.getElementById("country-flag");
const countryTitle=document.getElementById("country-title");
const countrySubitle=document.getElementById("country-subtitle");
const bulletPoints=document.getElementById("bullet-points");
mapboxgl.accessToken="pk.eyJ1IjoiY2Fzc291bGV4IiwiYSI6ImNsMHY4eHVvMTBtYnEzb2tiOG45NGJmcngifQ.Ninwt7Dqvbmw6fq_1N3Flg";
var map=new mapboxgl.Map({
  container:"map",
  style:"mapbox://styles/mapbox/dark-v10",
  center:[0,20],
  zoom:2
});
positionButtons.innerHTML="";
countries.forEach(country=>{
  const button=document.createElement("button");
  button.addEventListener("click",()=>flyTo(country.name));
  button.innerHTML=country.name+`<i class="fas fa-rocket"></i>`;
  button.classList.add("fly-button");
  positionButtons.appendChild(button);
});
map.addControl(new mapboxgl.NavigationControl());
map.on("load",()=>{
  const features=countries.map(country=>({
    type:"Feature",
    properties:{
      description:country.name,
      icon:"rocket-15"
    },
    geometry:{
      type:"Point",
      coordinates:[country.GPS[1],country.GPS[0]]
    }
  }))
  map.addSource("places",{
    type:"geojson",
    data:{type:"FeatureCollection",features}
  });
  map.addLayer({
    id:"places",
    type:"symbol",
    source:"places",
    layout:{
      "icon-image":"{icon}",
      "icon-allow-overlap":true
    }
  });
  map.on("click","places",e=>{
    flyTo(e.features[0].properties.description);
  });
  map.on("mouseenter","places",()=>{
    map.getCanvas().style.cursor="pointer";
  });
  map.on("mouseleave","places",()=>{
    map.getCanvas().style.cursor="";
  });
});
function flyTo(c){
  const country=countries.find(e=>e.name==c);
  countryTitle.textContent=country.name;
  countrySubitle.textContent=country.subtitle;
  countryFlag.src=country.flag;
  bulletPoints.innerHTML="";
  country.values.forEach(value=>{
    const element=document.createElement("li");
    element.classList.add("list-item");
    if(value.startsWith("[d]")){
      value=value.slice(3);
      element.classList.add("list-in-list-item");
    };
    element.textContent=value;
    bulletPoints.append(element);
  });
  map.flyTo({
    center:[country.GPS[1],country.GPS[0]],
    essential:true,
    zoom:5
  });
  setTimeout(()=>countryPage.hidden=false,7.5e2);
};
function leavePage(){
  countryPage.hidden=true;
  map.flyTo({
    center:[0,20],
    zoom:2
  });
};
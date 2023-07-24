gsap.registerPlugin(Flip);  //package used for animation


//window onloading popup screen
const popup = document.querySelector('.popup');
const close = document.querySelector('.close');
window.onload = async function (){
    await getAPI();
    automaticSlideChair();
    setTimeout(function(){
        automaticSlideCouch();
        popup.style.display='block';
    },1500)
}
//close button on popup screen
close.addEventListener('click',()=>{
    popup.style.display='none';
});


//navbar animation
const links = document.querySelectorAll(".nav-item a");
const activeNav = document.querySelector(".active-nav");
links.forEach((link)=>{
    link.addEventListener("click", ()=>{
        gsap.to(links, {color: "#252525"});

        if(document.activeElement === link){
            gsap.to(link, {color: "#385ae0"});
        }

        const state = Flip.getState(activeNav);
        link.appendChild(activeNav);
        Flip.from(state, {
            duration: 1.25,
            absolute: true,
            ease: "elastic.out(1,0.5)",
        });
    });
});

//feature card animation
function appendFeatures() {
    let cards = document.querySelectorAll('.card');

    cards.forEach((card, index)=>{
        card.addEventListener("click", ()=>{

            const state = Flip.getState(cards);
            const isCardActive = card.classList.contains("active");
            cards.forEach((otherCard, otherIdx)=> {
                otherCard.classList.remove("active");
                otherCard.classList.remove("is-inactive");
                if(!isCardActive && index!==otherIdx){
                    otherCard.classList.add("is-inactive");
                }
            });
            if(!isCardActive) card.classList.add("active");  
            
            Flip.from(state, {
                duration: 1,
                absolute: true,
                ease: "expo.out",
            });
        });
    });
}



var chairList = [];
var couchList = [];

//get request to database in javascript
async function getAPI() {
    let chairs = await fetch("http://jsdemo.onrender.com/upload/chairs");
    let couchs = await fetch("http://jsdemo.onrender.com/upload/couchs");
    var features = await fetch("http://jsdemo.onrender.com/features");
    //handling 2nd promise
    chairs = await chairs.json();
    couchs = await couchs.json();
    features = await features.json();
    //passing features object to set function
    setFeatures(features); 
    //adding image name to list
    for(let i=0; i<chairs.length; i++)
    {
        chairList.push(chairs[i]['name']);
    }
    for(let i=0; i<couchs.length; i++)
    {
        couchList.push(couchs[i]['name']);
    }
}

//slide couch images of section1
var firstIndexCouch=1;
function automaticSlideCouch () {
    var indexCouch = firstIndexCouch%(couchList.length);
    firstIndexCouch++;
    // alert(imageList[index]);
    const imgCouch = document.getElementById("section1");
    imgCouch.style.backgroundImage = "url(./upload/images/couchs/"+couchList[indexCouch]+")";
    setTimeout(automaticSlideCouch,2000);
};

//changing color of section2 chairs
var firstIndexChair=1;
function automaticSlideChair () {
    var indexChair = firstIndexChair%(chairList.length);
    firstIndexChair++;
    //alert(chairList);
    const imgChair = document.getElementById("section2Image");
    imgChair.src= `./upload/images/chairs/${chairList[indexChair]}`;
    setTimeout(automaticSlideChair,1000);
}

//appending div to section 3 one by one
function setFeatures(features) {
    const section3 = document.getElementById("section3");
    
    for(let i = 0; i< features.length; i++ )
    {
        let div = document.createElement("div");
        div.className = "card";
        let image = document.createElement("img");
        let name = document.createElement("h1");
        let desc = document.createElement("p");
        
        image.src = `./images/${features[i]["image"]}`;
        image.alt = `Couch${i+1}`;
        name.innerText = features[i]["name"];
        desc.innerText = features[i]["description"];

        div.appendChild(image);
        div.appendChild(name);
        div.appendChild(desc);

        section3.appendChild(div);
    }
    //calling append function after the all element div is added to document
    appendFeatures();
}

//scroll back to top button
const goTopBtn = document.querySelector('.go-top-btn');
//checking scrolling effect of window
window.addEventListener('scroll', checkHeight)
function checkHeight() {
    if(window.scrollY > 240){
        goTopBtn.style.display = 'flex'
    } else {
        goTopBtn.style.display = 'none'

    }
}
goTopBtn.addEventListener('click',()=>{
    window.scrollTo({
        top:0,
    })
})

//animated appearance of the input form
const info = document.querySelector('.Info');
function displayInfo() {
    info.classList.add('active')
}
function removeInfo() {
    info.classList.remove('active')
    return false;
}


// new fullpage('#fullpage', {
//     autoScrolling: true,
//     responsivewidth: 700,
//     navigation: true,
//     onLeave: function(origin,destination,direction){
//         console.log("Leaving section"+origin.index);
//         const section = destination.item;
//         const title = section.querySelector("h1");
//         const tl = new TimelineMAx({delay:0.5});
//         tl.fromTo(title, 0.5, {y:"50", opacity: 0},{y:0, opacity:1});

//         if(destination.index === 1) {
//             const chairs = document.querySelectorAll('.chair');
//             const description = document.querySelector('.description');

//             tl.fromTo(chairs,0.7,{x:"100%"},{x:"-35%"})
//             .fromTo(description, 0.5, {y:"50", opacity: 0},{y:0, opacity:1})
//             .fromTo(chairs[0], 1,{opacity: 1}, {opacity1})            
//             .fromTo(chairs[1], 1,{opacity: 0}, {opacity1})            
//             .fromTo(chairs[2], 1,{opacity: 0}, {opacity1})            
//         }
//     },
// });

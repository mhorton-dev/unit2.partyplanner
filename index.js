const url = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2505-FTB-ET-WEB-FT/`
const state = {events:[]}



//get events through API call
const getEvents = async () => {
    try{
        const response = await fetch(`${url}/events`)
        if(response.status === 200){
            events = await response.json();
        }
        
       state.events = await events.data
    } catch(err) {
        const error = new Error("getEvents Error");
        error.cause = err
        throw error;
    } 
}

const render =  async() => {
    const appSection = document.querySelector("#app")
    appSection.setAttribute("dir", "ltr")
        appSection.innerHTML = `
            <section class = 'upcoming-parties'>
                <h2>Upcoming Parties</h2>
            </section>
            <section class = 'party-details'>
                <h2>Party Details</h2>
                <h3 id='details-party-name' class='party-name-h3'></h3>
            </section>`
    const upcomingPartySection = document.querySelector(`.upcoming-parties`)
    const upcomingTable = document.createElement("table")
    upcomingTable.setAttribute("class", "upcoming-table")
    const upcomingRow = document.createElement("tr")
    upcomingRow.setAttribute("class", "upcoming-row")
    
    const eachParty = () => {state.events.forEach(party => {
        if (party.name != undefined){
            const upcomingCell = document.createElement("td")
            upcomingCell.setAttribute("class", "upcoming-cell")
            upcomingCell.setAttribute("id", party.id)
            upcomingCell.innerText = party.name
            const cellId = upcomingCell.id
            upcomingCell.addEventListener("click", (ev) = async () => {
                await getDetails(cellId)
            })
            upcomingRow.appendChild(upcomingCell)
        }
    })}
    await eachParty()
    appSection.appendChild(upcomingPartySection)
    upcomingTable.appendChild(upcomingRow)
    upcomingPartySection.appendChild(upcomingTable)
}
//Now details
const getDetails = async (id) => {
    try {
        clearDetails()
        console.log("Detail url", `${url}events/${id}`)
        const response = await fetch(`${url}events/${id}`)
        if (response.status === 200){
            details = await response.json()
            details = details.data

            //Set up detail section objects
            const appSection = document.querySelector("#app")
            const detailsSection = document.querySelector(".party-details")
            appSection.appendChild(detailsSection)
            const partyNameHeader = document.querySelector("#details-party-name")
    
            console.log("Party details object",)
            //update and append section objects
            for (key in details) {
                const detailsPara = document.createElement("p")
                detailsPara.setAttribute("class", "details-paragraph")
                switch(key) {
                    case "name":partyNameHeader.innerText = await details[key];
                        detailsSection.appendChild(partyNameHeader);break
                    case "date":detailsPara.innerText = `${key}: ${Date(details[key])}`;
                        detailsSection.appendChild(detailsPara);break
                    case "location", "description":detailsPara.innerText = `${key}: ${details[key]}`;
                        detailsSection.appendChild(detailsPara);break
                }
            }            
        }
         await getGuests(arr =[])
    } catch (err) {
        const error = new Error("getDetails Error")
        error.cause = err
        throw error
    }  
}

const clearDetails = async () => {
    const detailsSection = document.querySelector(".party-details")
    detailsSection.innerHTML = `
        <section class = 'party-details'>
            <h2>Party Details</h2>
            <h3 id='details-party-name' class='party-name-h3'></h3>
        </section>`
}

const getGuests = async () => {
    try {
        const partyDetails = document.querySelector(".party-details")
        const guestList = document.createElement("ul")
        guestList.setAttribute("class", "guest-list")
        const response =  await fetch(`${url}/guests`)
        if (response.status === 200) {
            let guests = await response.json()
            guests =  await guests.data
        
            await guests.forEach((guest => {
                const listItem = document.createElement('li')
                listItem.innerText = guest.name
                guestList.appendChild(listItem)
                }))
                partyDetails.appendChild(guestList)
            }
        }
    catch(err) {
        const error = "getGuests error"
            error.cause = err
            throw error
    }
}

let init = async () => {
    await getEvents()
    await render()
}

window.onload = init()
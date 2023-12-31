export default class Kpi{
  constructor(apiRequests, messaging){
    this.apiRequests = apiRequests
    this.messaging = messaging
    this.valuesMap = new Map()
  }

  async listKpi(dataKpi){
    const { _id, dashboardName, name, preset, numberField, typeKpi } = dataKpi

    const contDashboards = document.querySelector('#contDashboards')
    const card = document.createElement('div')
    card.classList.add('cardDash')

    const titleCard = document.createElement('h1')
    titleCard.innerText = name

    const contentKpi = document.createElement('div')
    contentKpi.id = _id

    card.appendChild(titleCard)
    card.appendChild(contentKpi)

    contDashboards.appendChild(card)
    await this.generateKpi(dataKpi)
  }

  async generateKpi(dataKpi){
    if(!this.valuesMap.get(dataKpi.preset)){
      let response = await this.apiRequests.getVeluesApi(dataKpi.preset)
      this.valuesMap.set(dataKpi.preset, response)
    }

    const dataOfPreset = this.valuesMap.get(dataKpi.preset)
    const container = document.getElementById(`${dataKpi._id}`)

    switch(dataKpi.typekpi){
      case 'common':
        this.generateCommonKpi(container, dataOfPreset, dataKpi)
      break
      case 'average':
        this.generateAverageKpi(container, dataOfPreset, dataKpi)
      break
      case 'totalSum':
        this.generateTotalSumKpi(container, dataOfPreset, dataKpi)
      break
      default:
        console.log('Default');
      break
    }
  }

  generateCommonKpi(container, dataOfPreset, dataKpi){
    let counter = {}
    let highestFrequencyNumber = 0

    for (const document of dataOfPreset) {
      const { numberField } = dataKpi

      const currentValue = String(document[numberField])
      const keyCounter = counter[currentValue]
      
      if(keyCounter){
        counter[currentValue] = counter[currentValue] + 1
        if(keyCounter > highestFrequencyNumber){
          highestFrequencyNumber = currentValue
        }
      }else{
        counter[currentValue] = 1
      }
    }

    container.innerHTML = `<h1>${highestFrequencyNumber}</h1>` 
  }

  generateAverageKpi(container, dataOfPreset, dataKpi){
    const totalSum = dataOfPreset.reduce((ac, vl) => {
      const fieldValue = vl[dataKpi.numberField]
      
      return ac += fieldValue
    }, 0)

    const average = (totalSum / dataOfPreset.length).toFixed(2)

    container.innerHTML = `<h1>${average}</h1>` 
  }

  generateTotalSumKpi(container, dataOfPreset, dataKpi){
    const totalSum = dataOfPreset.reduce((ac, vl) => {
      const fieldValue = vl[dataKpi.numberField]
      
      return ac += fieldValue
    }, 0)

    container.innerHTML = `<h1>${totalSum.toFixed(2)}</h1>` 
  }
}
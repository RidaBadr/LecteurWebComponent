import template from './template.js'
import '../../../lib/webaudio-controls.js'

let ctx = window.AudioContext || window.webkitAudioContext

export default class AudioLector extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.equalizerFrequencies = [60, 170, 350, 1000, 3500, 10000]
        this.filters = []
        this.fftSizeWaveForm = 1024
        this.fftSizeFrequencies = 64

        this.init().then(async () => {
            await this.initDraw()
            console.log(
                `${this.innerTitle.innerHTML}: Initialisation is a success!!`
            )
        })
    }

    init = async () => {
        this.initAudioNodes()
        this.initQuerySelectors()
        this.initAttribute().then(() => {
            this.audioPlayer.src = this.srcAttribute
        })

        try {
            this.connectAudioNodes().then(() => {
                console.log(
                    `${this.innerTitle.innerHTML}: Audio node schema is mounted!`
                )
            })
        } catch (e) {
            console.log('there is an error connecting audio nodes!')
        }
        this.shadowRoot.querySelector('#title').innerHTML = this.titleAttribute
        this.initEventListener()
    }

    connectAudioNodes = async () => {
        let gainAudioPlayerSource = this.audioContext.createMediaElementSource(
            this.audioPlayer
        )

        gainAudioPlayerSource.connect(this.filters[0])

        for (let i = 0; i < this.filters.length - 1; i++) {
            this.filters[i].connect(this.filters[i + 1])
        }

        this.filters[this.filters.length - 1].connect(this.panNode)

        this.panNode.connect(this.gainNode)
        this.gainNode.connect(this.dest)

        //Connexion au visualiseur
        this.gainNode.connect(this.analyserWaveForm)
        this.gainNode.connect(this.analyserFrequencies)
    }

    initAudioNodes = () => {
        this.audioContext = new ctx()
        this.dest = this.audioContext.destination

        this.gainNode = this.audioContext.createGain()
        this.panNode = this.audioContext.createStereoPanner()

        //Pour la longueur d'onde
        this.analyserWaveForm = this.audioContext.createAnalyser()
        this.analyserWaveForm.fftSize = this.fftSizeWaveForm
        this.analyserWaveForm.bufferLength = this.analyserWaveForm.frequencyBinCount
        this.analyserWaveForm.dataArray = new Uint8Array(
            this.analyserWaveForm.bufferLength
        )

        //Pour la visualisation de fréquence
        this.analyserFrequencies = this.audioContext.createAnalyser()
        this.analyserFrequencies.fftSize = this.fftSizeFrequencies
        this.analyserFrequencies.bufferLength = this.analyserFrequencies.frequencyBinCount
        this.analyserFrequencies.dataArray = new Uint8Array(
            this.analyserFrequencies.bufferLength
        )

        this.initEqualizer()
    }

    initEventListener = () => {
        this.gainSlider.oninput = (e) => {
            this.gainNode.gain.value = e.target.value
            this.gainValue.innerHTML = e.target.value
        }

        this.button.backward.addEventListener('click', this.goBackward)
        this.button.forward.addEventListener('click', this.gorForward)

        this.stereoPanner.oninput = (e) => {
            this.panNode.pan.setValueAtTime(
                e.target.value,
                this.audioContext.currentTime
            )
        }

        this.button.play.addEventListener('click', this.play)
        this.button.pause.addEventListener('click', this.pause)
        this.button.stop.addEventListener('click', this.stop)

        this.equalizerInputs.forEach((e, i) => {
            e.oninput = (e) => {
                this.filters[i].gain.value = e.target.value
                this.equalizerValues[i].innerHTML = e.target.value
            }
        })

        this.switchDrawInput.oninput = (e) => {
            this.canvasFrequencies.style.visibility = e.target.checked
                ? 'hidden'
                : 'visible'
        }

        this.switchLoop.oninput = (e) => {
            this.audioPlayer.loop = e.target.checked
        }

        this.audioPlayer.onplay = () => {
            this.audioContext.resume()
        }
    }

    initAttribute = async () => {
        this.srcAttribute = this.getAttribute('src')
        this.titleAttribute = this.innerHTML
    }

    initQuerySelectors = () => {
        this.audioPlayer = this.shadowRoot.querySelector('.audio-element')
        this.gainSlider = this.shadowRoot.querySelector('#gain')
        this.stereoPanner = this.shadowRoot.querySelector('#panner')
        this.equalizerInputs = this.shadowRoot.querySelectorAll('[id^=eq-in-]')
        this.equalizerValues = this.shadowRoot.querySelectorAll('#eq-value')
        this.switchDrawInput = this.shadowRoot.querySelector('.switch')
        this.switchLoop = this.shadowRoot.querySelector('#loop')
        this.gainValue = this.shadowRoot.querySelector('#gain-value')
        this.button = {
            play: this.shadowRoot.querySelector('#play'),
            pause: this.shadowRoot.querySelector('#pause'),
            backward: this.shadowRoot.querySelector('#backward'),
            forward: this.shadowRoot.querySelector('#forward'),
            stop: this.shadowRoot.querySelector('#stop'),
        }
        this.innerTitle = this.shadowRoot.querySelector('#title')
        this.canvasWaveForm = this.shadowRoot.querySelector('#wave-form')
    }

    play = () => {
        this.audioPlayer.play()
        this.audioContext.resume()
    }

    pause = () => {
        this.audioPlayer.pause()
    }

    initEqualizer = () => {
        this.equalizerFrequencies.forEach((freq) => {
            const eq = this.audioContext.createBiquadFilter()
            eq.frequency.value = freq
            eq.type = 'peaking'
            eq.gain.value = 0
            this.filters.push(eq)
        })
    }

    drawWaveForm = () => {
        let width = this.canvasWaveForm.width
        let height = this.canvasWaveForm.height
        let canvasContext = this.canvasWaveForm.getContext('2d')

        canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)'
        canvasContext.fillRect(0, 0, width, height)

        this.analyserWaveForm.getByteTimeDomainData(
            this.analyserWaveForm.dataArray
        )

        canvasContext.lineWidth = 2
        canvasContext.strokeStyle = '#313131'

        canvasContext.beginPath()

        let sliceWidth = width / this.analyserWaveForm.bufferLength
        let x = 0

        for (let i = 0; i < this.analyserWaveForm.bufferLength; i++) {
            // Données Les valeurs du tableau sont comprises entre 0 et 255,
           
            let v = this.analyserWaveForm.dataArray[i] / 255
            //y sera en [0, canvas height], en pixels
            let y = v * height

            if (i === 0) {
                canvasContext.moveTo(x, y)
            } else {
                canvasContext.lineTo(x, y)
            }

            x += sliceWidth
        }

        canvasContext.lineTo(
            this.canvasWaveForm.width,
            this.canvasWaveForm.height / 2
        )

        canvasContext.stroke()

        requestAnimationFrame(this.drawWaveForm)
    }

    drawFrequencies = () => {
        let width = this.canvasFrequencies.width
        let height = this.canvasFrequencies.height
        let canvasContext = this.canvasFrequencies.getContext('2d')

        // vider canvas
        canvasContext.clearRect(0, 0, width, height)
        // Obtenir les données d'analyse
        this.analyserFrequencies.getByteFrequencyData(
            this.analyserFrequencies.dataArray
        )

        let barWidth = width / this.analyserFrequencies.bufferLength
        let barHeight
        let x = 0
        // les valeurs vont de 0 à 255 et la hauteur de la toile est de 100. Redimensionnons alors
         // avant de dessiner. C'est le facteur d'échelle
        let heightScale = height / 128
        for (let i = 0; i < this.analyserFrequencies.bufferLength; i++) {
            // between 0 and 255
            barHeight = this.analyserFrequencies.dataArray[i]

            // La couleur est rouge mais plus claire ou plus foncée selon la valeur
            canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'
            // échelle de [0, 255] à la hauteur du canvas [0, hauteur] pixels
            barHeight *= heightScale
            // tirer la barre
            canvasContext.fillRect(
                x,
                height - barHeight / 2,
                barWidth,
                barHeight / 2
            )

            // 1 est le nombre de pixels entre les barres on pourra le modifier
            x += barWidth + 1
        }
        // appele à nouveau la fonction de visualisation à 60 images/s
        requestAnimationFrame(this.drawFrequencies)
    }

    initDraw = async () => {
        requestAnimationFrame(this.drawWaveForm)
        requestAnimationFrame(this.drawFrequencies)
    }

    gorForward = () => {
        this.audioPlayer.currentTime += 10
    }

    goBackward = () => {
        this.audioPlayer.currentTime -= 10
    }

    stop = () => {
        this.audioPlayer.pause()
        this.audioPlayer.currentTime = 0
    }
}

customElements.define('audio-lector', AudioLector)

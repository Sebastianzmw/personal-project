const seedColorInput = document.getElementById('seed-color')
const schemeSelectInput = document.getElementById('color-scheme')
const generateBtn = document.getElementById('generate-btn')
const colorsContainer = document.getElementById('colors-container')

generateBtn.addEventListener("click", getColorScheme)

function getColorScheme(){
	const	colorHex = seedColorInput.value.substring(1)
	const	schemeMode = schemeSelectInput.value

	fetch(`https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${schemeMode}&count=5`)
		.then(res => res.json())
		.then(data => {
			renderColorScheme(data.colors)	
		})
		.catch(error => {
			console.error('Error fetching color scheme:', error)
		})
}

function renderColorScheme(colors){
	colorsContainer.innerHTML = ''

	colors.forEach(color => {
		const colorDiv = document.createElement('div')
		colorDiv.className = 'color-swatch'
		colorDiv.style.backgroundColor = color.hex.value

		const hexValue = document.createElement('p')
		hexValue.className = 'color-hex'
		hexValue.textContent = color.hex.value

		colorDiv.addEventListener("click", () => {
			navigator.clipboard.writeText(color.hex.value)
			.then(() => {
				hexValue.textContent = "Copied!"
				setTimeout(() => {
					hexValue.textContent = color.hex.value
				}, 1000)
			})
		})

		colorDiv.appendChild(hexValue)
		colorsContainer.appendChild(colorDiv)
	})
}

document.addEventListener("DOMContentLoaded", getColorScheme)
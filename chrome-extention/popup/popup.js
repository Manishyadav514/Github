function newFunction(e) {
    const method = e.target.id
    switch (method) {
        case "imageHide":
            removeImage()
            console.log(method)
            break;
        case "increaseContrast":
            console.log(method)
            break;
        case "dylexic":
            console.log(method)
            break;
        default:
            console.log(method)
    }
}

// remove image 
async function removeImage() {
    const images = document.querySelectorAll('img');
    console.log({ images })
    images.forEach(image => {
        const blankDiv = document.createElement('div');
        blankDiv.style.width = image.width + 'px';
        blankDiv.style.height = image.height + 'px';
        blankDiv.style.backgroundColor = 'black';  // Set background color to white
        image.parentNode.replaceChild(blankDiv, image);
    });

}

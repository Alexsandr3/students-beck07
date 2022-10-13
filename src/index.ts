import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

let videos: any[] = []

const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

const port = process.env.PORT || 5001

app.get('/', (req: Request, res: Response) => {
    res.send("Hi, need or greed!")
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    let error: {errorsMessages: any[]} = {
        errorsMessages: []
    }
    let title = req.body.title
    let author = req.body.author
    let availableResolutions = req.body.availableResolutions

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40){
        error.errorsMessages.push({
            "message": "Incorrect title",
            "field": "title"
        })
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20){
        error.errorsMessages.push({
            "message": "Incorrect author",
            "field": "author"
        })
    }

    if (availableResolutions){
        if(!Array.isArray(availableResolutions)){
            error.errorsMessages.push({
                "message": "Incorrect availableResolutions",
                "field": "availableResolutions"
            })
        } else {
            availableResolutions.forEach(resolution => {
                !AvailableResolutions.includes(resolution) && error.errorsMessages.push({
                    "message": "Incorrect availableResolutions",
                    "field": "availableResolutions"
                })
            })
        }
    }

    if (error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }
    let createdAt = new Date().toISOString()
    let publicationDate = new Date(Date.now() + (3600 * 1000 * 24)).toISOString()

    const newVideo = {
        id: +(new Date().getTime()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions
    }
    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.videoId)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(404)
        return;
    }
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
    let error: {errorsMessages: any[]} = {
        errorsMessages: []
    }
    let title = req.body.title
    let author = req.body.author
    let canBeDownloaded = req.body.canBeDownloaded
    let minAgeRestriction = req.body.minAgeRestriction
    let publicationDate = req.body.publicationDate
    let availableResolutions = req.body.availableResolutions

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40){
        error.errorsMessages.push({
            "message": "Incorrect title",
            "field": "title"
        })
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20){
        error.errorsMessages.push({
            "message": "Incorrect author",
            "field": "author"
        })
    }
    if (typeof canBeDownloaded !== "boolean"){
        error.errorsMessages.push({
            "message": "Incorrect canBeDownloaded",
            "field": "canBeDownloaded"
        })
    }
    if (minAgeRestriction > 18 || minAgeRestriction < 1){
        error.errorsMessages.push({
            "message": "Incorrect minAgeRestriction",
            "field": "minAgeRestriction"
        })
    }
    if (!publicationDate || typeof publicationDate !== new Date().toISOString() || !publicationDate.trim()){
        error.errorsMessages.push({
            "message": "Incorrect publicationDate",
            "field": "publicationDate"
        })
    }
    if (availableResolutions){
        if(!Array.isArray(availableResolutions)){
            error.errorsMessages.push({
                "message": "Incorrect availableResolutions",
                "field": "availableResolutions"
            })
        } else {
            availableResolutions.forEach(resolution => {
                !AvailableResolutions.includes(resolution) && error.errorsMessages.push({
                    "message": "Incorrect availableResolutions",
                    "field": "availableResolutions"
                })
            })
        }
    }

    if (error.errorsMessages.length){
        res.status(400).send(error)
        return;
    }

    const video = videos.find(v => v.id === +(req.params.videoId))
    if (video) {
        video.title = req.body.title;
        video.author = req.body.author;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.createdAt = req.body.createdAt;
        video.publicationDate = req.body.publicationDate;
        video.availableResolutions = req.body.availableResolutions;

        res.status(204).send(video)
    } else {
        res.sendStatus(404)
    }

})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const newVideos =videos.filter(v => v.id !== id)
    if (newVideos.length < videos.length){
        videos = newVideos
        res.send(204)
    } else {
        res.status(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

// fd
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
    let date = new Date()
    date.setDate(date.getDate() + 1)
    let publicationDate = date.toISOString()

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

    if (!video){
        res.sendStatus(404)
        return;
    }

    res.send(video)
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
    if (typeof publicationDate !== 'string'){
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

    if (!video){
        res.sendStatus(404)
        return;
    }


        video.title = req.body.title;
        video.author = req.body.author;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.createdAt = req.body.createdAt;
        video.publicationDate = req.body.publicationDate;
        video.availableResolutions = req.body.availableResolutions;

        res.sendStatus(204)
})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;

    const newVideos = videos.find(v => v.id === id)

    if (!newVideos){
        res.sendStatus(404)
        return;
    }

    videos = newVideos
    res.send(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
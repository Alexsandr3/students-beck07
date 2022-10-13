import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

let videos: videosType[]
videos = [
    {
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2022-10-12T16:47:24.225Z",
        "publicationDate": "2022-10-12T16:47:24.225Z",
        "availableResolutions": [
            "P144"
        ]
    }
]

const port = process.env.PORT || 5001

app.get('/', (req: Request, res: Response) => {
    res.send("Hi, need or greed!")
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
   let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim() || title.lenght> 40) {
        res.status(400).send({
            errorsMessage: [{
                "message": "Incorrect title",
                "field": "tilte"
            }],
        })
        return;
    }
    let author = req.body.author
    if (!author || typeof author !== 'string' || !author.trim() || title.lenght> 20) {
        res.status(400).send({
            errorsMessage: [{
                "message": "Incorrect author",
                "field": "author"
            }],
        })
        return;
    }

    const newVideo = {
        "id": +(new Date()),
        "title": req.body.title,
        "author": "beeBrick",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": new Date().toISOString(),
        "publicationDate": new Date().toISOString(),
        "availableResolutions": [
            "P144"
        ]
    }
    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const video = videos.find(i => i.id === +(req.params.videoId))
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(404)
    }
    return;
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
    let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim() || title.lenght> 40) {
        res.status(400).send({
            errorsMessage: [{
                "message": "Incorrect title",
                "field": "tilte"
            }],
        })
        return;

        const video = videos.find(i => i.id === +(req.params.videoId))
        if (video) {
            video.title = req.body.title
            res.status(204).send(video)
        } else {
            res.send(400)
        }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
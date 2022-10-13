import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

type videosType = {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: null,
        createdAt: string,
        publicationDate: string,
        availableResolutions: string []
}

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

let videos: videosType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-10-13T08:30:01.050Z",
        publicationDate: "2022-10-13T08:30:01.050Z",
        availableResolutions: [
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
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40){
        res.status(400).send({
            errorsMessages: [{
                    "message": "Incorrect title",
                    "field": "title"
                }]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: "beeBrick",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [
            "P144"
        ]
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
    }
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
    let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40){
        res.status(400).send({
            errorsMessages: [{
                "message": "Incorrect title",
                "field": "title"
            }]
        })
        return;
    }

    const video = videos.find(v => v.id === +(req.params.videoId))
    if (video) {
        video.title = req.body.title
        res.status(204).send(video)
    } else {
        res.sendStatus(400)
    }
})

app.delete('/videos/:videoId', (req: Request, res: Response) => {
    for (let i=0; i< videos.length; i++) {
       if  (videos[i].id === +req.params.id){
           videos.splice(i,1);
       }
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
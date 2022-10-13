import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

let videos: any[] = []

const port = process.env.PORT || 5001

app.get('/', (req: Request, res: Response) => {
    res.send("Hi, need or greed!")
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']


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
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 40){
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
        res.send(error).status(400)
        return;
    }


    const newVideo = {
        id: +(new Date().getTime()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
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
    res.sendStatus(204)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
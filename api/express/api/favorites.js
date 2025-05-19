const { ObjectId } = require("mongodb")

module.exports.setApp = function (app, client) {
  // Get Flight by ID
  app.get("/api/favorites/id/:flightId", async (req, res) => {
    const flightId = req.params.flightId
    let db

    try {
      db = client.db("app")
      const flight = await db
        .collection("favorites")
        .findOne({ _id: new ObjectId(flightId) })

      if (!flight) {
        return res.status(404).json({ error: "Flight not found" })
      }

      return res.status(200).json({
        _id: flight._id,
        flight_num: flight.flight_num,
        origin: flight.origin,
        dest: flight.dest,
        date: flight.date,
        location: flight.location,
      })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: "Failed to retrieve flight" })
    }
  })

  // Get Flight by Flight Number
  app.get("/api/favorites/flightNum/:flightNum", async (req, res) => {
    const flightNum = req.params.flightNum
    let db

    try {
      db = client.db("app")
      const flight = await db
        .collection("favorites")
        .findOne({ flight_num: flightNum })

      if (!flight) {
        return res.status(404).json({ error: "Flight not found" })
      }

      return res.status(200).json({
        _id: flight._id,
        flight_num: flight.flight_num,
        origin: flight.origin,
        dest: flight.dest,
        date: flight.date,
        location: flight.location,
      })
    } catch (e) {
      console.error(e)
      return res
        .status(500)
        .json({ error: "Failed to retrieve flight by number" })
    }
  })
}

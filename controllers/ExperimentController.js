const Experiment = require("../models/Experiment");

class ExperimentController {
  static async getAllExperiments(req, res) {
    try {
      const { category } = req.query;
      const filter = category ? { category } : {};
      const experiments = await Experiment.find(filter);
      res.json(experiments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createExperiment(req, res) {
    try {
      const experiment = new Experiment(req.body);
      await experiment.save();
      res.status(201).json(experiment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateExperiment(req, res) {
    try {
      const oldId = req.params.id;
      const newId = req.body.id;
      if (newId && newId !== oldId) {
        // Check if new id already exists
        const existing = await Experiment.findOne({ id: newId });
        if (existing) {
          return res
            .status(400)
            .json({ message: "Experiment with new ID already exists" });
        }
        // Update the document's id and other fields
        const experiment = await Experiment.findOneAndUpdate(
          { id: oldId },
          req.body,
          { new: true }
        );
        if (!experiment)
          return res.status(404).json({ message: "Experiment not found" });
        // If the id was changed, update the id field and save
        experiment.id = newId;
        await experiment.save();
        res.json(experiment);
      } else {
        const experiment = await Experiment.findOneAndUpdate(
          { id: oldId },
          req.body,
          { new: true }
        );
        if (!experiment)
          return res.status(404).json({ message: "Experiment not found" });
        res.json(experiment);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteExperiment(req, res) {
    try {
      const experiment = await Experiment.findOneAndDelete({
        id: req.params.id,
      });
      if (!experiment)
        return res.status(404).json({ message: "Experiment not found" });
      res.json({ message: "Experiment deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ExperimentController;

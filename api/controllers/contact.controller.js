// contactController.js
// Import contact model
Contact = require("../models/contact.model");

exports.index = function (req, res) {
  Contact.get(function (err, contacts) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: contacts
    });
  });
};

// Handle create user actions
exports.new = function (req, res) {
  Contact.find({ mobile: req.body.mobile.trim() }, function (err, contacts) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    if (contacts && contacts.length > 0) {
      res.status(400).send({
        status: "error",
        message: req.body.firstName + " is already exist"
      });
    } else {
      var contact = new Contact();
      var contactObj = req.body;
      Object.keys(contactObj).forEach((key, index) => {
        contact[key] = contactObj[key];
      });

      // save the contact and check for errors
      contact.save(function (err) {
        if (err) {
          res.status(400).json({
            status: "error",
            error: err
          });
        }
        res.json({
          message: "New contact created!",
          data: contact
        });
      });
    }
  });

  // Handle view contact info
  exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
      if (err) {
        res.status(400).json({
          status: "error",
          error: err
        });
      }
      res.json({
        message: "Contact details loading..",
        data: contact
      });
    });
  };
  // Handle update contact info
  exports.update = function (req, res) {
    Contact.findByIdAndUpdate(
      req.params.contact_id,
      req.body,
      { new: true },
      function (err, contact) {
        if (err) {
          res.status(400).json({
            status: "error",
            error: err
          });
        }

        // save the contact and check for errors
        contact.save(function (err) {
          if (err) res.json(err);
          res.json({
            message: "Contact Info updated",
            data: contact
          });
        });
      }
    );
  };
  // Handle delete state
  exports.delete = function (req, res) {
    Contact.remove(
      {
        _id: req.params.contact_id
      },
      function (err, state) {
        if (err) {
          res.status(400).json({
            status: "error",
            error: err
          });
        }
        res.json({
          status: "success",
          message: "Contact deleted"
        });
      }
    );
  };
};
// Handle view state info
exports.view = function (req, res) {
  Contact.findById(req.params.contact_id, function (err, contact) {
    if (err) {
      res.status(400).json({
        status: "error",
        error: err
      });
    }
    res.json({
      message: "contact details loading..",
      data: contact
    });
  });
};
// Handle update state info
exports.update = function (req, res) {
  Contact.findByIdAndUpdate(
    req.params.contact_id,
    req.body,
    { new: true },
    function (err, contact) {
      if (err) {
        res.status(400).json({
          status: "error",
          error: err
        });
      }

      // save the contact and check for errors
      contact.save(function (err) {
        if (err) res.json(err);
        res.json({
          message: "contact Info updated",
          data: contact
        });
      });
    }
  );
};
// Handle delete state
exports.delete = function (req, res) {
  Contact.remove(
    {
      _id: req.params.contact_id
    },
    function (err, contact) {
      if (err) {
        res.status(400).json({
          status: "error",
          error: err
        });
      }
      res.json({
        status: "success",
        message: "contact deleted"
      });
    }
  );
};

module.exports = (req, res, next) => {
    const email = (req.body.email || "").trim().toLowerCase();

    if (!email.endsWith("@stud.ase.ro")) {
        return res.status(400).json({
            message: "Trebuie să folosești emailul instituțional! ",
        });
    }

    next();
};

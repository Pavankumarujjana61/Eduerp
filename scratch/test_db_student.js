const { Class, Student, Parent, User } = require('../server/models');
const bcrypt = require('bcryptjs');

async function test() {
    try {
        const class_name = 'Class 7';
        let teacherId = 1;
        
        console.log("Looking up class:", class_name);
        let [cls] = await Class.findOrCreate({
            where: { class_name },
            defaults: { class_name, class_teacher_id: teacherId }
        });
        console.log("Class found/created successfully! ID:", cls.id);

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Database query failed:", err);
        process.exit(1);
    }
}

test();

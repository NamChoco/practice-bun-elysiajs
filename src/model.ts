import { Database } from "bun:sqlite";
import { status } from "elysia";

const db = new Database("mydb.db");

const getMembers = () => {
    try {
        const query = db.query('SELECT * FROM member ');
        return query.all()
    } catch (error) {
        console.log("Error: " + error)
        return
    }
}

const getMember = (id: number) => {
    try {
        const query = db.query('SELECT * FROM member WHERE id=$id');
        return query.get({
            $id: id
        })
    } catch (error) {
        console.log("Error: " + error)
        return
    }
}

const createMember = ( member : any ) => {
    try {
        if (!member.name || !member.email || !member.date_of_birth){
            throw new Error('Validation Fail')
        }
        const query = db.query(`INSERT INTO member (name, email, date_of_birth) VALUES ($name, $email, $date_of_birth);`)
        query.run({
            $name: member.name,
            $email: member.email,
            $date_of_birth: member.date_of_birth
        })
        return { status: 'ok' }
    } catch (error) {
        console.log(" " + error)
        return { status: 'error' }
    }
}

const updateMember = (id: number, member: any) => {
    try {
        const query = db.query(`UPDATE member SET name=$name, email=$email, date_of_birth=$date_of_birth WHERE id=$id`)
        query.run({
            $id: id,
            $name: member.name,
            $email: member.email,
            $date_of_birth: member.date_of_birth
        })
        return { status: 'ok' }
    } catch (error) {
        console.log("Error: " + error)
        return { status: 'error' }
    }
}

const deleteMember = (id: number) => {
    try {
        const query = db.query(`DELETE FROM member WHERE id=$id`)
        query.run({
            $id: id,
        })
        return { status: 'ok' }
    } catch (error) {
        console.log("Error: " + error)
        return
    }
}

// console.log(getMembers(2))

// console.log(createMember({
//     name: "Kaimook",
//     email: "kaimook@gmail.com",
//     date_of_birth: "2002-08-06"
// }))

// console.log(updateMember(1, {
//     name: "A",
//     email: "B@gmail.com",
//     date_of_birth: "2002-08-06"
// }))


export {
    getMember,
    getMembers,
    createMember,
    updateMember,
    deleteMember,
}
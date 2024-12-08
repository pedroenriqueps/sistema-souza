import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { schema } from "@/app/components/Register/utils"

export async function POST(request: NextRequest) {
    try {
        const clientData = await request.json();
        const { username, accessKey, password, repeatPassword } = clientData;
        const salt = process.env.SALT ? parseInt(process.env.SALT, 10) : 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        await schema.validate(clientData, { abortEarly: false })

        if (!username || !accessKey || !password || !repeatPassword) {
            return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        if (accessKey !== process.env.ACCESS_KEY) {
            return NextResponse.json({ message: "A sua chave de acesso está incorreta" }, { status: 401 });
        }

        if (password !== repeatPassword) {
            return NextResponse.json({ message: "As senhas informadas estão divergentes" }, { status: 401 });
        }

        const existingUser = await prisma.createUser.findUnique({
            where: { username: clientData.username },
        })
        if (existingUser) {
            return NextResponse.json({ message: "Nome de usuário já está em uso" }, { status: 409 });
        }

        const newUser = await prisma.createUser.create({
            data: {
                username: username,
                password: hashedPassword,
            }
        });

        return NextResponse.json({ message: "Usuário criado com sucesso", user: newUser }, { status: 201 });

    } catch (error: unknown) {
        console.error("Erro a ocriar usuário", error);
        const errorMessage = error instanceof Error ? error.message : "Houve um erro interno inesperado";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "sdjsidjslcdofacncdoiaedhwuacbsbcavdivj";

const COOKIE_MAX_AGE = 60 * 60 * 1000

export async function POST(request: NextRequest) {
    try {
        const clientData = await request.json();
        const { username, password } = clientData;

        if (!username || !password) {
            return NextResponse.json({ message: "Usuário e senha são obrigatórios." }, { status: 400 });
        }

        const user = await prisma.createUser.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: "Usuário ou senha inválidos." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Usuário ou senha inválidos." }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "4h" }
        );

        const response = NextResponse.json({ message: "Login realizado com sucesso." }, { status: 201 });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: COOKIE_MAX_AGE,
            path: "/",
        });

        return response;

    } catch (error: unknown) {
        console.error("Erro ao fazer login", error);
        const errorMessage = error instanceof Error ? error.message : "Houve um erro interno inesperado";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

"use client"
import Image from "next/image";
import { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import Link from "next/link"
import { AiOutlineShopping } from "react-icons/ai"
import { GiMoneyStack } from "react-icons/gi"
import { MdAutoGraph } from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { PiHandWithdrawLight } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5"

export function HeaderMenuBar() {
    const [activeMenu, setActiveMenu] = useState<boolean>(false)

    const handleMenu = () => {
        setActiveMenu(!activeMenu)
    }

    return (
        <>
            <header className="flex items-center justify-between px-4 py-2 bg-slate-800 text-white shadow-lg relative z-50 mb-7">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Logotipo de souza construções"
                        width={260}
                        height={100}
                        className="object-contain"
                    />
                </Link>

                <button
                    type="button"
                    onClick={handleMenu}
                    className="text-white text-2xl hover:text-slate-400 transition"
                >
                    <CiMenuFries />
                </button>
                {activeMenu && (
                    <nav className="absolute right-0 top-16 bg-slate-800 shadow-md w-[70%] h-screen">
                        <ul className="flex flex-col p-3 space-y-2 gap-y-4 text-white">
                            <li>
                                <Link href="/" className="flex justify-start items-center hover:text-slate-400">
                                    <IoHomeOutline className="mr-2" size={22} /> Produtos
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/create-shopping" className="flex justify-start items-center hover:text-slate-400">
                                    <AiOutlineShopping className="mr-2" size={22} /> Adicionar compra
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/create-sale" className="flex justify-start items-center hover:text-slate-400">
                                    <GiMoneyStack className="mr-2" size={22} /> Adicionar venda

                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/graphics" className="flex justify-start items-center hover:text-slate-400">
                                    <MdAutoGraph className="mr-2" size={22} />Gráficos
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/history-shopping" className="flex justify-start items-center hover:text-slate-400">
                                    <BiPurchaseTagAlt className="mr-2" size={22} /> Histórico de compras
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/list-sale" className="flex justify-start items-center hover:text-slate-400">
                                    <PiHandWithdrawLight className="mr-2" size={22} /> Histórico de vendas
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </header>

        </>
    )
}

export function HeaderAuth() {
    return (
        <header className="flex justify-center my-10">
            <Image src="/logo.png" alt="Logotipo de souza construções" width={260} height={100}></Image>
        </header>
    )
}
import { useTranslations } from "next-intl";


export default function HomeView() {
    const t = useTranslations("Home");
    return (
        <div>
        <>Home View</>
        <h2>{t("title")}</h2>
        </div>
    );
}

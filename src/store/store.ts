import { init, Models, RematchDispatch } from '@rematch/core'
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/updated'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import swimLanes from './models/swimLanes'
import menu from './models/menu'

interface RootModal extends Models<RootModal> {
  swimLanes: typeof swimLanes;
  menu: typeof menu;
}

type FullModel = ExtraModelsFromLoading<RootModal> & ExtraModelsFromUpdated<RootModal>

const models = { swimLanes, menu }

const store = init<RootModal, FullModel>({
  models,
  plugins: [
    loadingPlugin(),
    updatedPlugin(),
  ],
})
export default store

export type RootState = RematchDispatch<typeof models>
export type RootDispatch = RematchDispatch<typeof models>

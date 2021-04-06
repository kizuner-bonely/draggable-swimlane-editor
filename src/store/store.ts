import { init, Models, RematchDispatch } from '@rematch/core'
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/updated'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import swimLanes from './models/swimLanes'

interface RootModal extends Models<RootModal> {
  swimLanes: typeof swimLanes;
}

type FullModel = ExtraModelsFromLoading<RootModal> & ExtraModelsFromUpdated<RootModal>

const models = { swimLanes }

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
